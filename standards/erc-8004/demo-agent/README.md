# 8004-demo-agent

[ERC-8004](https://8004.org) · [Registration Guide](https://github.com/erc-8004/best-practices/blob/main/Registration.md) · [Reputation Guide](https://github.com/erc-8004/best-practices/blob/main/Reputation.md) · [Agent0 SDK](https://sdk.ag0.xyz/)

---

A demo agent to showcase ERC-8004 registration best practices. 

Built using [create-8004-agent](https://www.npmjs.com/package/create-8004-agent)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Edit `.env` and add your API keys:

```env
# Already set if wallet was auto-generated
PRIVATE_KEY=your_private_key

# Get from https://pinata.cloud (free tier works)
PINATA_JWT=your_pinata_jwt

# Get from https://platform.openai.com
OPENAI_API_KEY=your_openai_key
```

### 3. Fund your wallet

Your agent wallet: `0x66615821b1340A544700c4bfdc8868Bf349C675B`

Get testnet ETH from: https://cloud.google.com/application/web3/faucet/ethereum/sepolia

### 4. Register on-chain

```bash
npm run register
```

This will:
- Upload your agent metadata to IPFS
- Register your agent on Ethereum Sepolia
- Output your agent ID and 8004scan link

### 5. Start the A2A server

```bash
npm run start:a2a
```

Test locally: http://localhost:3000/.well-known/agent-card.json

### 6. Start the MCP server

```bash
npm run start:mcp
```

## Project Structure

```
8004-demo-agent/
├── src/
│   ├── register.ts      # Registration script
│   ├── agent.ts         # LLM logic
│   └── a2a-server.ts   # A2A server
│   └── mcp-server.ts   # MCP server
├── .env                 # Environment variables (keep secret!)
└── package.json
```

## OASF Skills & Domains (Optional)

Add capabilities and domain expertise to help others discover your agent.

Edit `src/register.ts` and uncomment/add before `registerIPFS()`:

```typescript
// Add skills (what your agent can do)
agent.addSkill('natural_language_processing/natural_language_generation/summarization');
agent.addSkill('analytical_skills/coding_skills/text_to_code');

// Add domains (areas of expertise)  
agent.addDomain('technology/software_engineering');
agent.addDomain('finance_and_business/investment_services');
```

Browse the full taxonomy: https://schema.oasf.outshift.com/0.8.0

## Going Live

By default, your agent is registered with `active: false`. This is intentional - it lets you test without appearing in explorer listings.

When you're ready for production:
1. Edit `src/register.ts` and change `agent.setActive(false)` to `agent.setActive(true)`
2. Re-run `npm run register` to update your agent's metadata

## Next Steps

1. Update the endpoint URLs in `src/register.ts` with your production domain
2. Customize the agent logic in `src/agent.ts`
3. Deploy to a cloud provider (Vercel, Railway, etc.)
4. Re-run `npm run register` if you change metadata

## Resources

- [ERC-8004 Spec](https://eips.ethereum.org/EIPS/eip-8004)
- [8004scan Explorer](https://www.8004scan.io/)
- [Agent0 SDK Docs](https://sdk.ag0.xyz/)
- [OASF Taxonomy](https://github.com/8004-org/oasf)
- [Registration Guide](https://github.com/erc-8004/best-practices/blob/main/Registration.md)
- [Reputation Guide](https://github.com/erc-8004/best-practices/blob/main/Reputation.md)

## License

MIT
