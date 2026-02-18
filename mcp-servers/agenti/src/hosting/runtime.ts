/**
 * MCP Hosting Platform - Server Runtime
 * @description Dynamic MCP server creation and routing for hosted servers
 * @author nirholas
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { HostedMCPServer, HostedMCPTool } from "./types.js"
import { calculatePayout, PLATFORM_FEE_PERCENTAGE } from "./types.js"
import Logger from "@/utils/logger.js"

// In-memory cache of running servers (in production, use Redis)
const serverCache = new Map<string, {
  server: McpServer;
  config: HostedMCPServer;
  lastAccess: Date;
}>()

/**
 * Create an MCP server from hosted configuration
 */
export async function createHostedServer(config: HostedMCPServer): Promise<McpServer> {
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js")
  
  const server = new McpServer({
    name: config.name,
    version: "1.0.0",
    description: config.description,
  })
  
  // Register tools
  for (const tool of config.tools.filter(t => t.enabled)) {
    registerHostedTool(server, tool, config)
  }
  
  // Register prompts - using simplified registration
  for (const prompt of config.prompts.filter(p => p.enabled)) {
    // Note: prompt() signature may vary by MCP SDK version
    // Using type assertion for flexibility
    (server as any).prompt?.(
      prompt.name,
      prompt.description,
      async (args: Record<string, string>) => {
        // Simple template replacement
        let result = prompt.template
        for (const [key, value] of Object.entries(args)) {
          result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value))
        }
        return result
      }
    )
  }
  
  // Register resources - using simplified registration
  for (const resource of config.resources.filter(r => r.enabled)) {
    // Note: resource() signature may vary by MCP SDK version
    (server as any).resource?.(
      resource.name,
      resource.uri,
      { mimeType: resource.mimeType },
      async () => {
        if (resource.type === 'static') {
          return resource.content || ''
        }
        if (resource.type === 'dynamic' && resource.endpoint) {
          const response = await fetch(resource.endpoint)
          return response.text()
        }
        return ''
      }
    )
  }
  
  return server
}

/**
 * Register a hosted tool with payment handling
 */
function registerHostedTool(
  server: McpServer,
  tool: HostedMCPTool,
  config: HostedMCPServer
) {
  server.tool(
    tool.name,
    tool.description,
    tool.inputSchema,
    async (args: Record<string, unknown>) => {
      // Check for payment if tool has a price
      if (tool.price > 0) {
        const paymentProof = args._paymentProof as string | undefined
        
        if (!paymentProof) {
          const { creatorAmount, platformAmount } = calculatePayout(tool.price)
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: "Payment required",
                code: 402,
                payment: {
                  amount: tool.price,
                  currency: "USDC",
                  recipient: config.pricing.payoutAddress,
                  platformFee: platformAmount,
                  creatorReceives: creatorAmount,
                  network: "eip155:8453",
                }
              })
            }],
            isError: true
          }
        }
        
        // Verify payment on-chain (log for audit trail)
        // Production: use ethers/viem to verify tx receipt on the target network
        Logger.info("Payment proof received for hosted tool", {
          tool: tool.name,
          server: config.subdomain,
          amount: tool.price,
          paymentProof: typeof paymentProof === 'string' ? paymentProof.slice(0, 20) + '...' : 'invalid',
        })
      }
      
      // Execute the tool based on type
      let result: unknown
      
      switch (tool.type) {
        case 'http':
          if (!tool.endpoint) throw new Error("HTTP tool missing endpoint")
          result = await executeHttpTool(tool.endpoint, args)
          break
          
        case 'proxy':
          if (!tool.proxyTarget) throw new Error("Proxy tool missing target")
          result = await executeProxyTool(tool.proxyTarget, args)
          break
          
        case 'code':
          if (!tool.code) throw new Error("Code tool missing implementation")
          result = await executeCodeTool(tool.code, args)
          break
          
        default:
          throw new Error(`Unknown tool type: ${tool.type}`)
      }
      
      // Track usage — increment call count
      // Production: persist to database via prisma.hostedServer.update({ callCount++ })
      const cached = serverCache.get(config.subdomain)
      if (cached) {
        cached.lastAccess = new Date()
        cached.config.totalCalls = (cached.config.totalCalls || 0) + 1
        cached.config.callsThisMonth = (cached.config.callsThisMonth || 0) + 1
      }
      Logger.debug("Tool call tracked", { tool: tool.name, server: config.subdomain })
      
      return {
        content: [{
          type: "text",
          text: typeof result === 'string' ? result : JSON.stringify(result)
        }]
      }
    }
  )
}

/**
 * Execute HTTP tool - call external endpoint
 */
async function executeHttpTool(endpoint: string, args: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  
  if (!response.ok) {
    throw new Error(`HTTP tool failed: ${response.status}`)
  }
  
  return response.json()
}

/**
 * Execute proxy tool - forward to another MCP server
 */
async function executeProxyTool(target: string, args: Record<string, unknown>): Promise<unknown> {
  // MCP-to-MCP proxy: forward tool call to another MCP server via HTTP
  // Production: use @modelcontextprotocol/sdk Client to connect to the target server
  const targetUrl = target.startsWith('http') ? target : `https://${target}.agenti.cash/mcp`
  
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { arguments: args },
        id: Date.now(),
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Proxy target returned ${response.status}`)
    }
    
    const result = await response.json()
    return result?.result ?? result
  } catch (error) {
    Logger.error("MCP proxy call failed", { target: targetUrl, error: String(error) })
    throw new Error(`Proxy tool failed: ${error}`)
  }
}

/**
 * Execute code tool - run sandboxed JavaScript
 */
async function executeCodeTool(code: string, args: Record<string, unknown>): Promise<unknown> {
  // SECURITY: This needs proper sandboxing in production
  // Options: isolated-vm, quickjs-emscripten, or Cloudflare Workers
  
  // For now, use a very restricted eval with timeout
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  
  const safeGlobals = {
    console: { log: () => {}, error: () => {}, warn: () => {} },
    fetch: globalThis.fetch,
    JSON,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    args,
  }
  
  try {
    const fn = new AsyncFunction(
      ...Object.keys(safeGlobals),
      `"use strict"; return (async () => { ${code} })()`
    )
    
    const result = await Promise.race([
      fn(...Object.values(safeGlobals)),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tool execution timeout")), 5000)
      )
    ])
    
    return result
  } catch (error) {
    throw new Error(`Code execution failed: ${error}`)
  }
}

/**
 * Get or create server for subdomain
 */
export async function getServerForSubdomain(subdomain: string): Promise<McpServer | null> {
  // Check cache
  const cached = serverCache.get(subdomain)
  if (cached) {
    cached.lastAccess = new Date()
    return cached.server
  }
  
  // Load config from server cache or database
  // Production: query database — await prisma.hostedMCPServer.findUnique({ where: { subdomain } })
  // For now, only in-memory cache is available
  Logger.debug("Server lookup miss", { subdomain })
  return null
}

/**
 * Route request to appropriate hosted server
 */
export async function routeToHostedServer(
  subdomain: string,
  request: unknown
): Promise<unknown> {
  const server = await getServerForSubdomain(subdomain)
  
  if (!server) {
    return {
      error: "Server not found",
      code: 404,
      message: `No MCP server found at ${subdomain}.agenti.cash`
    }
  }
  
  // Route the JSON-RPC request through the hosted MCP server
  // The server object is an McpServer instance — in production this would
  // be connected via stdio/sse transport. For now, return server info.
  return {
    server: {
      name: (server as any).name || subdomain,
      status: 'running',
      subdomain,
    },
    message: `Request routed to ${subdomain}.agenti.cash — use MCP transport for full interaction`,
  }
}

export default {
  createHostedServer,
  getServerForSubdomain,
  routeToHostedServer,
}
