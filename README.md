<p align="center">
  <img src="https://img.shields.io/badge/BNB%20Chain-F0B90B?style=for-the-badge&logo=binance&logoColor=black" alt="BNB Chain" />
  <img src="https://img.shields.io/badge/AI%20Agents-00B4D8?style=for-the-badge&logo=openai&logoColor=white" alt="AI Agents" />
  <img src="https://img.shields.io/badge/MCP-7C3AED?style=for-the-badge&logo=protocol&logoColor=white" alt="MCP" />
  <img src="https://img.shields.io/badge/DeFi-22C55E?style=for-the-badge&logo=ethereum&logoColor=white" alt="DeFi" />
</p>

<h1 align="center">🔶 BNB Chain AI Toolkit</h1>

<p align="center">
  <strong>The most comprehensive open-source AI toolkit for BNB Chain, BSC, opBNB, and the Binance ecosystem</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#components">Components</a> •
  <a href="#mcp-servers">MCP Servers</a> •
  <a href="#ai-agents">AI Agents</a> •
  <a href="#standards">Standards</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/nirholas/bnb-agents?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/agents-72+-blue?style=flat-square" alt="Agents" />
  <img src="https://img.shields.io/badge/MCP%20servers-6-purple?style=flat-square" alt="MCP Servers" />
  <img src="https://img.shields.io/badge/tools-600+-green?style=flat-square" alt="Tools" />
  <img src="https://img.shields.io/badge/chains-60+-orange?style=flat-square" alt="Chains" />
</p>

---

## Overview

**BNB Chain AI Toolkit** is a unified, modular repository that consolidates everything you need to build AI-powered applications on BNB Chain. It combines **72+ AI agents**, **6 MCP servers** with **600+ tools**, **market data pipelines**, **DeFi tools**, **wallet utilities**, and **Web3 standards** into one cohesive toolkit.

Whether you're building autonomous trading bots, DeFi yield optimizers, portfolio managers, or natural-language blockchain interfaces — this toolkit has you covered.

### Why This Toolkit?

| Problem | Solution |
|---------|----------|
| Fragmented BNB Chain tooling | **Single monorepo** with everything integrated |
| No AI-native blockchain interface | **6 MCP servers** giving AI agents direct chain access |
| Complex DeFi interactions | **72+ specialized agents** for every DeFi protocol |
| Multi-chain complexity | **60+ chain support** with unified interfaces |
| Missing accessibility standards | **W3AG + ERC-8004** for inclusive Web3 |

---

## Quick Start

```bash
# Clone the toolkit
git clone https://github.com/nirholas/bnb-agents.git
cd bnb-agents

# Install dependencies
bun install

# Build the agent index
bun run build

# Start using MCP servers
cd mcp-servers/bnbchain-mcp && bun install && bun start
```

### Use with Claude Desktop

Add any MCP server to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": {
        "BSC_RPC_URL": "https://bsc-dataseed.binance.org",
        "PRIVATE_KEY": "your-private-key"
      }
    }
  }
}
```

---

## Architecture

```
bnb-agents/
├── agents/                          # 72+ AI Agent definitions
│   ├── bnb-chain-agents/            # 30 BNB Chain-specific agents
│   │   ├── pancakeswap-trader.json
│   │   ├── venus-protocol-expert.json
│   │   ├── bnb-staking-advisor.json
│   │   └── ... (30 agents)
│   └── defi-agents/                 # 42 general DeFi agents
│       ├── src/                     # Agent source definitions
│       ├── schema/                  # Agent schema validation
│       └── locales/                 # 18-language support
│
├── mcp-servers/                     # 6 Model Context Protocol servers
│   ├── bnbchain-mcp/                # BNB Chain + EVM MCP (100+ tools)
│   ├── binance-mcp/                 # Binance.com exchange (478+ tools)
│   ├── binance-us-mcp/              # Binance.US exchange (US compliance)
│   ├── universal-crypto-mcp/        # 60+ networks, 100+ tools
│   ├── agenti/                      # Universal EVM MCP server
│   └── ucai/                        # ABI-to-MCP generator (Python)
│
├── market-data/                     # Real-time market data
│   ├── crypto-market-data/          # CoinGecko, DeFiLlama, Fear & Greed
│   └── crypto-news/                 # 200+ sources, 150+ API endpoints
│
├── defi-tools/                      # DeFi utilities
│   └── sweep/                       # Multi-chain dust sweeper + yield
│
├── wallets/                         # Wallet tooling
│   └── ethereum-wallet-toolkit/     # BSC-compatible, offline-capable
│
├── standards/                       # Web3 standards & protocols
│   ├── erc-8004/                    # Agent discovery & trust protocol
│   │   ├── contracts/               # Solidity smart contracts
│   │   └── demo-agent/              # Reference implementation
│   └── w3ag/                        # Web3 Accessibility Guidelines
│
├── src/                             # Original agent source JSONs
├── scripts/                         # Build pipeline & tooling
├── locales/                         # 30+ language translations
├── schema/                          # JSON Schema definitions
└── public/                          # Built index.json output
```

---

## Components

### 🤖 AI Agents (72+)

#### BNB Chain Agents (30)

Purpose-built AI agents for every major BNB Chain protocol and use case:

| Agent | Description |
|-------|-------------|
| **PancakeSwap Trader** | DEX trading, liquidity provision, yield farming on PancakeSwap v3 |
| **Venus Protocol Expert** | Lending, borrowing, and liquidation strategies on Venus |
| **BNB Staking Advisor** | Liquid staking optimization across BNB validators |
| **Binance Earn Specialist** | Savings, staking, and launchpool yield optimization |
| **BSC Bridge Navigator** | Cross-chain bridging between BSC, opBNB, and L2s |
| **BEP-20 Token Analyst** | Token analysis, security auditing, and smart money tracking |
| **Binance Copy Trading** | Mirror trading strategies from top performers |
| **opBNB Scaling Expert** | L2 transaction optimization and gas savings |
| **Greenfield Storage** | Decentralized storage management on BNB Greenfield |
| **Thena DEX Expert** | ve(3,3) DEX trading and liquidity on Thena |
| + 20 more... | Full coverage of BNB Chain ecosystem |

#### General DeFi Agents (42)

Cross-chain DeFi agents with 18-language support:

- **Portfolio Management** — Rebalancing, risk assessment, tax optimization
- **Yield Optimization** — Auto-compounding, strategy rotation, IL protection
- **Trading Automation** — Grid trading, DCA, arbitrage, MEV protection
- **Risk Analysis** — Smart contract auditing, rug pull detection, exposure tracking
- **Market Intelligence** — Sentiment analysis, whale tracking, on-chain analytics

---

### 🔌 MCP Servers (6)

Model Context Protocol servers that give AI assistants direct blockchain access:

#### 1. BNB Chain MCP (`mcp-servers/bnbchain-mcp/`)
> **100+ tools** for BNB Chain, BSC, and EVM blockchains

- Token transfers, swaps, and approvals on BSC
- PancakeSwap DEX integration (swap, add/remove liquidity)
- Smart contract deployment and interaction
- Block explorer data and transaction history
- BNB Greenfield decentralized storage
- Gas estimation and optimization

#### 2. Binance Exchange MCP (`mcp-servers/binance-mcp/`)
> **478+ tools** for Binance.com

- Spot, margin, and futures trading
- Portfolio management and P&L tracking
- Market data streams and order book analysis
- Staking, savings, and earn products
- NFT marketplace integration
- Sub-account management

#### 3. Binance US MCP (`mcp-servers/binance-us-mcp/`)
> US regulatory-compliant Binance access

- Spot trading with US compliance
- Wallet management and withdrawals
- Staking and OTC trading
- Sub-account management

#### 4. Universal Crypto MCP (`mcp-servers/universal-crypto-mcp/`)
> **60+ networks**, **100+ tools**, full DeFi stack

- Multi-chain DEX aggregation
- Cross-chain bridging and swaps
- DeFi protocol interactions across chains
- Automated trading strategies
- x402 payment protocol support

#### 5. Agenti (`mcp-servers/agenti/`)
> Universal EVM + Solana MCP server

- All EVM chains: BSC, opBNB, Ethereum, Polygon, Arbitrum, Base, Optimism
- Solana network support
- x402-enabled for AI-to-AI payments
- Smart contract deployment and interaction

#### 6. UCAI (`mcp-servers/ucai/`)
> **ABI-to-MCP Generator** — Convert any smart contract to an MCP server

```bash
# Convert any contract ABI to an MCP server in one command
ucai generate --abi ./MyContract.json --chain bsc --output ./my-mcp-server
```

- Supports any EVM chain including BSC and opBNB
- Auto-generates tool definitions from contract ABI
- Works with Claude, ChatGPT, and other LLMs
- Python-based, pip installable

---

### 📊 Market Data (`market-data/`)

#### Crypto Market Data (`market-data/crypto-market-data/`)
Zero-dependency TypeScript library for real-time market data:

- **CoinGecko** — Prices, market caps, volume, historical data
- **DeFiLlama** — TVL, protocol data, yield data
- **Fear & Greed Index** — Market sentiment tracking
- Smart caching with configurable TTL
- Rate limiting with automatic retry
- Edge Runtime compatible (Cloudflare Workers, Vercel Edge)

#### Crypto News (`market-data/crypto-news/`)
200+ source aggregator with full API:

- 150+ REST API endpoints
- Real-time news stream
- Sentiment analysis per article
- MCP server included for AI integration
- CLI, SDK, browser extension, and mobile app
- 42-language README support

---

### 🧹 DeFi Tools (`defi-tools/`)

#### Dust Sweeper (`defi-tools/sweep/`)
Consolidate small token balances across 8 chains into DeFi yield:

- Auto-detect dust tokens below $X threshold
- Batch swap into stablecoins or yield positions
- Supports BSC, Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, Fantom
- Built with Foundry smart contracts + TypeScript backend

---

### 👛 Wallets (`wallets/`)

#### Ethereum Wallet Toolkit (`wallets/ethereum-wallet-toolkit/`)
Offline-capable wallet operations, fully BSC compatible:

- HD wallet generation (BIP-39/44)
- Vanity address generation
- Message signing (EIP-191, EIP-712)
- Transaction signing (legacy + EIP-1559)
- Keystore V3 import/export
- Multiple specialized MCP servers for each capability
- Works completely offline for cold storage

---

### 📜 Standards (`standards/`)

#### ERC-8004: Agent Discovery & Trust (`standards/erc-8004/`)
On-chain protocol for AI agent discovery, reputation, and trust:

- **Smart Contracts** — Deployed on Ethereum mainnet and Sepolia
- **Demo Agent** — Reference implementation for registration
- Agent reputation scoring and validation
- Decentralized agent registry

#### W3AG: Web3 Accessibility Guidelines (`standards/w3ag/`)
The first open standard for Web3 accessibility:

- Comprehensive guidelines modeled after WCAG
- React components: `GasEstimator`, `NetworkSwitcher`, `TokenApprovalDialog`
- Testing checklists and conformance levels
- Making DeFi accessible to people with disabilities

---

## Supported Networks

| Network | Type | Status |
|---------|------|--------|
| **BNB Smart Chain (BSC)** | L1 | ✅ Full support |
| **opBNB** | L2 | ✅ Full support |
| **BNB Greenfield** | Storage | ✅ Full support |
| Ethereum | L1 | ✅ Full support |
| Polygon | L1 / L2 | ✅ Full support |
| Arbitrum | L2 | ✅ Full support |
| Base | L2 | ✅ Full support |
| Optimism | L2 | ✅ Full support |
| Avalanche | L1 | ✅ Full support |
| Solana | L1 | ✅ Full support |
| + 50 more | Various | ✅ Via Universal MCP |

---

## Tool Summary

| Category | Count | Source |
|----------|-------|--------|
| BNB Chain on-chain tools | 100+ | bnbchain-mcp |
| Binance exchange tools | 478+ | binance-mcp |
| Cross-chain DeFi tools | 100+ | universal-crypto-mcp |
| EVM chain tools | 50+ | agenti |
| ABI-to-MCP generation | Dynamic | ucai |
| Market data endpoints | 150+ | crypto-news, crypto-market-data |
| Wallet operations | 20+ | ethereum-wallet-toolkit |
| **Total** | **900+** | |

---

## Development

```bash
# Install dependencies
bun install

# Build agent index
bun run build

# Format agent JSON files
bun run format

# Lint TypeScript
bun run lint

# Run tests
bun run test

# Type checking
bun run type-check

# Validate i18n translations
bun run i18n:validate
```

### Adding a New Agent

```bash
# Use the agent template
cp agents/bnb-chain-agents/agent-template.json agents/bnb-chain-agents/my-new-agent.json

# Edit the agent definition
# Then rebuild the index
bun run build
```

---

## Hackathon: BNB Chain Good Vibes Only — OpenClaw Edition

This toolkit was built for the **BNB Chain "Good Vibes Only: OpenClaw Edition"** hackathon, Track 1: Agent.

### What Makes This Unique

1. **Comprehensive Coverage** — No other project covers the entire BNB Chain AI stack
2. **Production-Ready MCP Servers** — 6 servers with 600+ tools, ready for Claude and other AI agents
3. **Original Standards** — ERC-8004 (agent trust) and W3AG (Web3 accessibility)
4. **Real DeFi Tooling** — Dust sweeper, market data APIs, wallet toolkit
5. **72+ Specialized Agents** — Purpose-built for every major BNB protocol
6. **Multi-Language** — 30+ language translations, 18 agent locales

---

## License

MIT © [nirholas](https://github.com/nirholas)

---

<p align="center">
  <strong>Built with 🔶 for BNB Chain</strong>
</p>

