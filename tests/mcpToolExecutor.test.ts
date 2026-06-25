import { describe, expect, it } from 'vitest';

import { createInMemoryMcpToolExecutor } from '../server/mcp/mcpToolExecutor.js';

describe('MCP tool executor', () => {
  it('lists the MVP ecommerce tools through MCP', async () => {
    const executor = await createInMemoryMcpToolExecutor();

    try {
      const tools = await executor.listTools();

      expect(tools.map((tool) => tool.function.name)).toEqual([
        'getProduct',
        'recommendProduct',
        'getOrder',
        'getLogistics',
        'getCoupon',
        'getFaq',
        'getRefundPolicy',
        'transferToHuman',
      ]);
    } finally {
      await executor.close();
    }
  });

  it('executes ecommerce tools through MCP', async () => {
    const executor = await createInMemoryMcpToolExecutor();

    try {
      const result = await executor.execute('getOrder', {
        orderId: 'ORD202600001',
      });

      expect(result).toMatchObject({ success: true });
    } finally {
      await executor.close();
    }
  });
});
