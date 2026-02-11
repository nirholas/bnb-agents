# Binance-US-MCP Development Guidelines

> A Model Context Protocol (MCP) server for Binance.US API. Provides standardized access to market data, spot trading, wallets, accounts, staking, OTC, sub-accounts, and institutional features. Built in TypeScript/Node.js. Handles authentication, rate limiting, and errors automatically. Ideal for AI agents and devs.

## Project Overview

Binance-US-MCP is built with TypeScript. See the README for full documentation.

### Terminal Management

- **Always use background terminals** (`isBackground: true`) for every command so a terminal ID is returned
- **Always kill the terminal** after the command completes, whether it succeeds or fails — never leave terminals open
- Do not reuse foreground shell sessions — stale sessions block future terminal operations in Codespaces
- In GitHub Codespaces, agent-spawned terminals may be hidden — they still work. Do not assume a terminal is broken if you cannot see it
- If a terminal appears unresponsive, kill it and create a new one rather than retrying in the same terminal

## Contributing

- Follow the existing code style
- Test changes before submitting PRs
- Update documentation when adding features
- See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines
