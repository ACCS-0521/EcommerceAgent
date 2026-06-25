import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { toolSpecs } from '../agent/toolCatalog.js';

export function createEcommerceMcpServer(): McpServer {
  const server = new McpServer({
    name: 'ecommerce-agent-tools',
    version: '0.1.0',
  });

  for (const tool of toolSpecs) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      async (args) => {
        const result = await tool.execute(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result) }],
          structuredContent: asStructuredContent(result),
        };
      },
    );
  }

  return server;
}

function asStructuredContent(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
