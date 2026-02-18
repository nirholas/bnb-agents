# ERC-8004 Swift SDK

> Swift SDK for ERC-8004 Trustless AI Agent Registries on iOS/macOS.

## Installation

### Swift Package Manager

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/nirholas/erc8004-agent-creator.git", from: "0.1.0")
]
```

## Quick Start

```swift
import ERC8004

let client = try ERC8004Client(chainName: "bsc-testnet")

let meta = AgentMetadata(
    name: "My Swift Agent",
    description: "Built with the Swift SDK",
    services: [
        AgentService(name: "A2A", endpoint: "https://agent.example.com/a2a"),
        AgentService(name: "MCP", endpoint: "https://agent.example.com/mcp"),
    ]
)

let uri = try client.buildAgentUri(meta)
print("URI: \(uri.prefix(80))...")
```

## Supported Chains

| Config | Name | Chain ID |
|--------|------|----------|
| `Chains.bscTestnet` | BSC Testnet | 97 |
| `Chains.bsc` | BSC Mainnet | 56 |
| `Chains.ethereum` | Ethereum | 1 |
| `Chains.sepolia` | Sepolia | 11155111 |

## Keystore Support

Load a wallet from an encrypted Ethereum V3 keystore file:

```swift
let client = try ERC8004Client(
    keystorePath: URL(fileURLWithPath: "/path/to/keystore.json"),
    password: "my-password",
    chain: Chains.bscTestnet
)
print("Address: \(client.address!)")

// Export to a new keystore
let json = try client.exportKeystore(password: "new-password")
try json.write(to: URL(fileURLWithPath: "backup.json"))
```

Supports `scrypt` and `pbkdf2` KDFs with `aes-128-ctr` cipher using native `CommonCrypto`. No external dependencies required.

## API

### `ERC8004Client`

- `init(chain:)` / `init(chainName:)` — Create client
- `init(keystorePath:password:chain:)` — Create client from V3 keystore
- `init(keystorePath:password:chainName:)` — Create client from V3 keystore by chain name
- `exportKeystore(password:)` — Export private key as V3 keystore JSON
- `address` — Wallet address (if keystore loaded)
- `buildAgentUri(_:)` — Encode metadata as data URI
- `parseAgentUri(_:)` — Decode metadata URI
- `caip10Address(chainId:contractAddress:)` — Build CAIP-10 ID

### Types

- `AgentMetadata` — Agent registration metadata
- `AgentService` — Service endpoint
- `ChainConfig` — Chain configuration
- `KeystoreWallet` — Decrypted wallet (private key + address)
- `RegisteredAgent` — On-chain agent record

## Testing

```bash
swift test
```

## License

Apache-2.0
