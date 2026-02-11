/**
 * MCP Tools Definition
 * 
 * This file defines the tools your MCP server exposes.
 * Each tool has:
 * - name: Unique identifier for the tool
 * - description: What the tool does (shown to AI clients)
 * - inputSchema: JSON Schema defining expected parameters
 * 
 * Add your own tools by:
 * 1. Adding a tool definition to the 'tools' array
 * 2. Adding a case in handleToolCall() to implement it
 */

import { generateResponse } from './agent.js';

// ============================================================================
// Tool Definitions
// Add new tools here - these are exposed to MCP clients
// ============================================================================

export const tools = [
  {
    name: 'chat',
    description: 'Have a conversation with the AI agent',
    inputSchema: {
      type: 'object' as const,
      properties: {
        message: {
          type: 'string',
          description: 'The message to send to the agent',
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'echo',
    description: 'Echo back the input message (for testing)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        message: {
          type: 'string',
          description: 'The message to echo',
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'get_time',
    description: 'Get the current time',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  // Add more tools here, for example:
  // {
  //   name: 'search_database',
  //   description: 'Search the database for records',
  //   inputSchema: {
  //     type: 'object' as const,
  //     properties: {
  //       query: { type: 'string', description: 'Search query' },
  //       limit: { type: 'number', description: 'Max results' },
  //     },
  //     required: ['query'],
  //   },
  // },
];

// ============================================================================
// Tool Implementations
// Add the logic for each tool here
// ============================================================================

export async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    // Chat tool - uses the LLM agent
    case 'chat': {
      const message = args.message as string;
      const response = await generateResponse(message);
      return { response };
    }
    
    // Echo tool - simple test tool
    case 'echo': {
      const message = args.message as string;
      return { echoed: message };
    }
    
    // Get time tool - returns current timestamp
    case 'get_time': {
      return { time: new Date().toISOString() };
    }
    
    // Add your tool implementations here:
    // case 'search_database': {
    //   const query = args.query as string;
    //   const limit = (args.limit as number) || 10;
    //   const results = await searchDB(query, limit);
    //   return { results };
    // }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
