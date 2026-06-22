import { describe, expect, it } from 'vitest';

import type { Logistics } from '../server/types/Logistics.js';
import type { Order } from '../server/types/Order.js';
import type { Product } from '../server/types/Product.js';
import { readDataFile } from '../server/utils/fileReader.js';

describe('mock data integrity', () => {
  it('keeps every order linked to an existing user, product, and logistics record', async () => {
    const [orders, products, logistics, users] = await Promise.all([
      readDataFile<Order[]>('orders.json'),
      readDataFile<Product[]>('products.json'),
      readDataFile<Logistics[]>('logistics.json'),
      readDataFile<Array<{ userId: string }>>('users.json'),
    ]);
    const productIds = new Set(products.map((product) => product.id));
    const trackingNumbers = new Set(logistics.map((item) => item.trackingNo));
    const userIds = new Set(users.map((user) => user.userId));

    expect(orders.every((order) => productIds.has(order.productId))).toBe(true);
    expect(orders.every((order) => trackingNumbers.has(order.trackingNo))).toBe(true);
    expect(orders.every((order) => userIds.has(order.userId))).toBe(true);
  });
});
