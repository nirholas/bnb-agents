# ERC-8004 Rust SDK

> Rust SDK for interacting with ERC-8004 Trustless AI Agent Registries on any EVM chain.

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
erc8004 = "0.1"
```

## Quick Start

```rust
use erc8004::{ERC8004Client, ChainName, AgentMetadata};

#[tokio::main]
async fn main() -> erc8004::Result<()> {
    let client = ERC8004Client::new(ChainName::BscTestnet, None)?;
    
    // Build agent metadata
    let metadata = AgentMetadata::new("My Rust Agent", "Built with the Rust SDK")
        .with_service("A2A", "https://agent.example.com/a2a")
        .with_service("MCP", "https://agent.example.com/mcp");

    // Encode as data URI
    let uri = ERC8004Client::build_agent_uri(&metadata)?;
    println!("URI: {}", &uri[..80]);

    Ok(())
}
```

## Supported Chains

| Variant | Name | Chain ID |
|---------|------|----------|
| `ChainName::BscTestnet` | BSC Testnet | 97 |
| `ChainName::Bsc` | BSC Mainnet | 56 |
| `ChainName::Ethereum` | Ethereum | 1 |
| `ChainName::Sepolia` | Sepolia | 11155111 |

## Keystore Support

Enable the `keystore` feature to load wallets from encrypted Ethereum V3 keystore files:

```toml
[dependencies]
erc8004 = { version = "0.1", features = ["keystore"] }
```

```rust
use erc8004::{ERC8004Client, ChainName};

let client = ERC8004Client::from_keystore(
    ChainName::BscTestnet,
    "path/to/keystore.json",
    "my-password",
)?;
println!("Address: {:?}", client.address());

// Export to a new keystore JSON string
let json = client.export_keystore("new-password")?;
std::fs::write("backup.json", json)?;
```

## API

### `ERC8004Client`

- `new(chain, private_key)` — Create client
- `from_keystore(chain, path, password)` — Create client from V3 keystore *(requires `keystore` feature)*
- `export_keystore(password)` — Export private key as V3 keystore JSON *(requires `keystore` feature)*
- `address()` — Wallet address (if keystore/key loaded)
- `build_agent_uri(metadata)` — Encode metadata as data URI
- `parse_agent_uri(uri)` — Decode metadata URI
- `caip10_address(chain_id, address)` — Build CAIP-10 ID

### `AgentMetadata`

Builder pattern:

```rust
let meta = AgentMetadata::new("Name", "Description")
    .with_service("A2A", "https://...")
    .with_image("https://...");
```

### `IdentityRegistry`

- `register(uri)` — Register agent
- `owner_of(id)` — Token owner
- `token_uri(id)` — Metadata URI
- `balance_of(addr)` — Agent count

### `ReputationRegistry`

- `submit_score(id, domain, score, evidence)` — Submit score
- `get_score(id, domain)` — Domain score
- `get_aggregate_score(id)` — Aggregate score

## Testing

```bash
cargo test
```

## License

Apache-2.0
