import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import type { ToolDefinition } from '../agent/toolCatalog.js';
import { createEcommerceMcpServer } from './ecommerceMcpServer.js';

export interface McpToolExecutor {
  listTools(): Promise<ToolDefinition[]>;
  execute(name: string, argumentsValue: unknown): Promise<unknown>;
  close(): Promise<void>;
}

export async function createInMemoryMcpToolExecutor(): Promise<McpToolExecutor> {
  const server = createEcommerceMcpServer();
  const client = new Client({
    name: 'ecommerce-agent-api',
    version: '0.1.0',
  });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);

  return {
    async listTools() {
      const { tools } = await client.listTools();
      return tools.map((tool) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description ?? '',
          parameters: {
            ...tool.inputSchema,
            additionalProperties: false,
          },
        },
      }));
    },
    async execute(name, argumentsValue) {
      const result = await client.callTool({
        name,
        arguments: toRecord(argumentsValue),
      });

      if ('toolResult' in result) return result.toolResult;
      if (result.structuredContent) return result.structuredContent;

      const text = result.content.find((item) => item.type === 'text')?.text;
      if (!text) return result;

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    },
    async close() {
      await Promise.allSettled([client.close(), server.close()]);
    },
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}
