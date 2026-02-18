/**
 * Wallet connection and management utilities.
 * Private keys are stored in VSCode SecretStorage for security.
 * Supports encrypted keystore file import/export as the recommended auth method.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import { getChain, type ChainConfig } from './chains';
import { getContracts, IDENTITY_ABI, REPUTATION_ABI } from './contracts';

let currentWallet: ethers.Wallet | null = null;
let currentProvider: ethers.JsonRpcProvider | null = null;
let currentChainKey: string = 'bsc-testnet';

/** Tracks how the wallet was imported: 'keystore' or 'privateKey'. */
export type WalletAuthMethod = 'keystore' | 'privateKey';
let walletAuthMethod: WalletAuthMethod | null = null;

const WALLET_SECRET_KEY = 'erc8004.privateKey';
const WALLET_AUTH_METHOD_KEY = 'erc8004.walletAuthMethod';

/**
 * Initialize wallet from stored secret.
 * Backward compatible: existing privateKey in SecretStorage still works.
 */
export async function initWallet(
  context: vscode.ExtensionContext
): Promise<ethers.Wallet | null> {
  const privateKey = await context.secrets.get(WALLET_SECRET_KEY);
  if (!privateKey) {
    return null;
  }
  const storedMethod = await context.secrets.get(WALLET_AUTH_METHOD_KEY);
  walletAuthMethod = (storedMethod === 'keystore' ? 'keystore' : 'privateKey');
  return connectWithKey(privateKey);
}

/**
 * Connect wallet with a private key.
 */
export function connectWithKey(privateKey: string): ethers.Wallet {
  const chain = getActiveChain();
  const rpcUrl = getCustomRpcUrl() || chain.rpcUrl;
  currentProvider = new ethers.JsonRpcProvider(rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  currentWallet = new ethers.Wallet(privateKey, currentProvider);
  return currentWallet;
}

/**
 * Store private key in VSCode secrets and connect (raw private key flow).
 */
export async function connectWallet(
  context: vscode.ExtensionContext,
  privateKey: string
): Promise<ethers.Wallet> {
  await context.secrets.store(WALLET_SECRET_KEY, privateKey);
  await context.secrets.store(WALLET_AUTH_METHOD_KEY, 'privateKey');
  walletAuthMethod = 'privateKey';
  return connectWithKey(privateKey);
}

/**
 * Disconnect and clear stored wallet.
 */
export async function disconnectWallet(
  context: vscode.ExtensionContext
): Promise<void> {
  await context.secrets.delete(WALLET_SECRET_KEY);
  await context.secrets.delete(WALLET_AUTH_METHOD_KEY);
  currentWallet = null;
  currentProvider = null;
  walletAuthMethod = null;
}

/**
 * Get current connected wallet.
 */
export function getWallet(): ethers.Wallet | null {
  return currentWallet;
}

/**
 * Get current provider.
 */
export function getProvider(): ethers.JsonRpcProvider | null {
  return currentProvider;
}

/**
 * Get or create a provider (read-only, no wallet needed).
 */
export function ensureProvider(): ethers.JsonRpcProvider {
  if (currentProvider) {
    return currentProvider;
  }
  const chain = getActiveChain();
  const rpcUrl = getCustomRpcUrl() || chain.rpcUrl;
  currentProvider = new ethers.JsonRpcProvider(rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  return currentProvider;
}

/**
 * Set active chain and reconnect if wallet exists.
 */
export function setActiveChain(chainKey: string): void {
  currentChainKey = chainKey;
  // Reconnect provider with new chain
  const chain = getChain(chainKey);
  const rpcUrl = getCustomRpcUrl() || chain.rpcUrl;
  currentProvider = new ethers.JsonRpcProvider(rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  if (currentWallet) {
    currentWallet = currentWallet.connect(currentProvider);
  }
}

/**
 * Get active chain key.
 */
export function getActiveChainKey(): string {
  return currentChainKey;
}

/**
 * Get active chain config.
 */
export function getActiveChain(): ChainConfig {
  return getChain(currentChainKey);
}

/**
 * Get custom RPC URL from settings.
 */
function getCustomRpcUrl(): string | undefined {
  const config = vscode.workspace.getConfiguration('erc8004');
  const url = config.get<string>('rpcUrl');
  return url && url.length > 0 ? url : undefined;
}

/**
 * Get identity registry contract instance.
 */
export function getIdentityContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
  const contracts = getContracts(currentChainKey);
  const provider = signerOrProvider || currentWallet || ensureProvider();
  return new ethers.Contract(contracts.identity, IDENTITY_ABI, provider);
}

/**
 * Get reputation registry contract instance.
 */
export function getReputationContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
  const contracts = getContracts(currentChainKey);
  const provider = signerOrProvider || currentWallet || ensureProvider();
  return new ethers.Contract(contracts.reputation, REPUTATION_ABI, provider);
}

/**
 * Get wallet balance.
 */
export async function getBalance(): Promise<string> {
  if (!currentWallet || !currentProvider) {
    return '0';
  }
  const balance = await currentProvider.getBalance(currentWallet.address);
  return ethers.formatEther(balance);
}

/**
 * Shortened address for display.
 */
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if wallet is connected.
 */
export function isConnected(): boolean {
  return currentWallet !== null;
}

/**
 * Get current wallet auth method.
 */
export function getWalletAuthMethod(): WalletAuthMethod | null {
  return walletAuthMethod;
}

// ---------------------------------------------------------------------------
// Keystore support
// ---------------------------------------------------------------------------

/**
 * Decrypt a keystore JSON string and connect the wallet.
 * Stores the decrypted private key in SecretStorage for session persistence.
 */
export async function connectWithKeystore(
  context: vscode.ExtensionContext,
  keystoreJson: string,
  password: string
): Promise<ethers.Wallet> {
  // Validate that the input looks like JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(keystoreJson);
  } catch {
    throw new Error('The selected file is not valid JSON. Please choose a valid keystore file.');
  }

  // Basic structural check for keystore v3 format
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('crypto' in parsed || 'Crypto' in parsed)
  ) {
    throw new Error(
      'Invalid keystore file: missing "crypto" field. Please choose a valid Ethereum keystore file.'
    );
  }

  let decryptedWallet: ethers.Wallet;
  try {
    decryptedWallet = await ethers.Wallet.fromEncryptedJson(keystoreJson, password) as ethers.Wallet;
  } catch (err: any) {
    // ethers throws a generic error for wrong password
    if (
      err.message?.includes('invalid password') ||
      err.message?.includes('incorrect') ||
      err.code === 'INVALID_ARGUMENT'
    ) {
      throw new Error('Incorrect password. Please try again with the correct keystore password.');
    }
    throw new Error(`Failed to decrypt keystore: ${err.message}`);
  }

  // Store decrypted key and auth method
  await context.secrets.store(WALLET_SECRET_KEY, decryptedWallet.privateKey);
  await context.secrets.store(WALLET_AUTH_METHOD_KEY, 'keystore');
  walletAuthMethod = 'keystore';

  return connectWithKey(decryptedWallet.privateKey);
}

/**
 * Export the current wallet as an encrypted keystore JSON string.
 */
export async function exportKeystore(password: string): Promise<string> {
  if (!currentWallet) {
    throw new Error('No wallet connected. Connect a wallet before exporting.');
  }
  return currentWallet.encrypt(password);
}

/**
 * Open a file picker for a .json keystore file, prompt for password, and connect.
 */
export async function importKeystoreFile(
  context: vscode.ExtensionContext
): Promise<ethers.Wallet> {
  const fileUris = await vscode.window.showOpenDialog({
    canSelectMany: false,
    filters: { 'Keystore JSON': ['json'] },
    openLabel: 'Import Keystore',
    title: 'Select Keystore File',
  });

  if (!fileUris || fileUris.length === 0) {
    throw new Error('No file selected.');
  }

  const fileBytes = await vscode.workspace.fs.readFile(fileUris[0]);
  const keystoreJson = Buffer.from(fileBytes).toString('utf-8');

  const password = await vscode.window.showInputBox({
    title: 'Keystore Password',
    prompt: 'Enter the password for this keystore file',
    password: true,
    placeHolder: 'Password',
    validateInput: (v: string) => {
      if (!v || v.length === 0) {
        return 'Password is required';
      }
      return undefined;
    },
  });

  if (!password) {
    throw new Error('Password entry cancelled.');
  }

  return connectWithKeystore(context, keystoreJson, password);
}
