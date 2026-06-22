import { describe, expect, it } from 'vitest';

import { executeTool, toolDefinitions } from '../server/agent/toolRegistry.js';

describe('tool registry', () => {
  it('publishes exactly the eight MVP tool definitions', () => {
    expect(toolDefinitions.map((tool) => tool.function.name)).toEqual([
      'getProduct',
      'recommendProduct',
      'getOrder',
      'getLogistics',
      'getCoupon',
      'getFaq',
      'getRefundPolicy',
      'transferToHuman',
    ]);
  });

  it('validates arguments and dispatches a registered tool', async () => {
    const result = await executeTool('getOrder', { orderId: 'ORD202600001' });

    expect(result).toMatchObject({ success: true });
  });

  it('rejects missing required arguments', async () => {
    await expect(executeTool('getOrder', {})).rejects.toThrow('工具参数无效');
  });

  it('rejects tools outside the registry', async () => {
    await expect(executeTool('deleteOrder', {})).rejects.toThrow('未注册的工具');
  });
});
