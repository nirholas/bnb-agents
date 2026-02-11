/**
 * MCP (Model Context Protocol) Server
 * 
 * This server exposes tools that can be called by MCP-compatible clients
 * (like Claude Desktop, Cursor, or other AI assistants).
 * 
 * Learn more: https://modelcontextprotocol.io/
 * 
 * Communication: Uses stdio (standard input/output)
 * To test: npx @modelcontextprotocol/inspector
 */

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, handleToolCall } from './tools.js';

// ============================================================================
// Server Setup
// ============================================================================

/**
 * Create MCP server with name and capabilities
 * The 'tools' capability tells clients this server provides callable tools
 */
const server = new Server(
  {
    name: '8004-demo-agent-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {}, // Enable tools capability
    },
  }
);

// ============================================================================
// Request Handlers
// ============================================================================

/**
 * List available tools
 * Clients call this to discover what tools are available
 * The tools array is defined in tools.ts
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handle tool calls
 * When a client wants to use a tool, this handler routes to the right function
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const result = await handleToolCall(name, args ?? {});
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  // MCP uses stdio for communication (not HTTP)
  // Messages are passed via stdin/stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with MCP protocol on stdout
  console.error('🔧 MCP Server running on stdio');
}

main().catch(console.error);
