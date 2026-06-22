import type { Order } from '../types/Order.js';
import type { ToolResult } from '../types/ToolResult.js';
import { readDataFile } from '../utils/fileReader.js';

export async function getOrder(input: {
  orderId: string;
}): Promise<ToolResult<Order>> {
  const orderId = input.orderId.trim().toUpperCase();
  if (!orderId) return { success: false, error: '请提供订单号' };

  const orders = await readDataFile<Order[]>('orders.json');
  const order = orders.find((item) => item.orderId === orderId);
  return order
    ? { success: true, data: order }
    : { success: false, error: '未找到订单' };
}
