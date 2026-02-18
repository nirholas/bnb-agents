/** ✨ built by nich */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const mcpDir = join(__dirname, '..', 'mcp-servers');

describe('MCP Server Configuration', () => {
  const expectedServers = [
    'bnbchain-mcp',
    'binance-mcp',
    'binance-us-mcp',
    'universal-crypto-mcp',
    'agenti',
    'ucai',
  ];

  // ---- directory existence ----
  describe('Server directories exist', () => {
    for (const server of expectedServers) {
      it(`mcp-servers/${server}/ exists`, () => {
        expect(existsSync(join(mcpDir, server))).toBe(true);
      });
    }
  });

  // ---- package.json in each server ----
  describe('Each server has package.json', () => {
    for (const server of expectedServers) {
      const pkgPath = join(mcpDir, server, 'package.json');

      // ucai is Python-based, may not have package.json
      if (server === 'ucai') {
        it(`mcp-servers/${server}/ has package.json or pyproject.toml`, () => {
          const hasPkg = existsSync(pkgPath);
          const hasPy = existsSync(join(mcpDir, server, 'pyproject.toml'));
          const hasSetup = existsSync(join(mcpDir, server, 'setup.py'));
          const hasReqs = existsSync(join(mcpDir, server, 'requirements.txt'));
          expect(hasPkg || hasPy || hasSetup || hasReqs).toBe(true);
        });
        continue;
      }

      it(`mcp-servers/${server}/package.json exists`, () => {
        expect(existsSync(pkgPath)).toBe(true);
      });
    }
  });

  // ---- TypeScript MCP servers have source files ----
  describe('TypeScript servers have source directories', () => {
    const tsServers = expectedServers.filter((s) => s !== 'ucai');

    for (const server of tsServers) {
      it(`mcp-servers/${server}/ has src/ directory`, () => {
        const hasSrc = existsSync(join(mcpDir, server, 'src'));
        const hasIndex = existsSync(join(mcpDir, server, 'index.ts'));
        const hasLib = existsSync(join(mcpDir, server, 'lib'));
        expect(hasSrc || hasIndex || hasLib).toBe(true);
      });
    }
  });

  // ---- server.json references ----
  describe('server.json references', () => {
    const serverJsonPath = join(__dirname, '..', 'server.json');

    it('server.json exists', () => {
      expect(existsSync(serverJsonPath)).toBe(true);
    });

    it('is valid JSON', () => {
      const raw = readFileSync(serverJsonPath, 'utf-8');
      expect(() => JSON.parse(raw)).not.toThrow();
    });
  });

  // ---- at least 6 MCP servers ----
  it('has at least 6 MCP server directories', () => {
    const dirs = readdirSync(mcpDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    expect(dirs.length).toBeGreaterThanOrEqual(6);
  });
});
