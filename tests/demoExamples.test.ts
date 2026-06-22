import { describe, expect, it } from 'vitest';

import { getDemoExamples } from '../server/services/demoService.js';
import type { Order } from '../server/types/Order.js';
import { readDataFile } from '../server/utils/fileReader.js';

describe('demo examples', () => {
  it('derives example order and tracking numbers from JSON data', async () => {
    const [result, orders] = await Promise.all([
      getDemoExamples(),
      readDataFile<Order[]>('orders.json'),
    ]);
    const orderIds = new Set(orders.map((order) => order.orderId));
    const trackingNumbers = new Set(orders.map((order) => order.trackingNo));
    const orderExamples = result.examples.filter((example) => example.kind === 'order');
    const logisticsExample = result.examples.find((example) => example.kind === 'logistics');

    expect(orderExamples).toHaveLength(2);
    expect(orderExamples.every((example) => orderIds.has(example.reference))).toBe(true);
    expect(logisticsExample).toBeDefined();
    expect(trackingNumbers.has(logisticsExample?.reference ?? '')).toBe(true);
  });

  it('does not expose customer names, phone numbers, or addresses', async () => {
    const result = await getDemoExamples();
    const serialized = JSON.stringify(result);

    expect(serialized).not.toMatch(/138\*{4}/);
    expect(result.examples.every((example) => !('userId' in example))).toBe(true);
  });
});
