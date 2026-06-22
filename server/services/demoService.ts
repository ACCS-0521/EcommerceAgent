import type { Order } from '../types/Order.js';
import { readDataFile } from '../utils/fileReader.js';

export interface DemoExample {
  id: string;
  kind: 'order' | 'logistics' | 'coupon';
  label: string;
  description: string;
  message: string;
  reference: string;
}

export async function getDemoExamples(): Promise<{ examples: DemoExample[] }> {
  const orders = await readDataFile<Order[]>('orders.json');
  const signedOrder = orders.find((order) => order.status === '已签收');
  const shippingOrder = orders.find((order) => order.status === '运输中');

  if (!signedOrder || !shippingOrder) {
    throw new Error('演示数据缺少已签收或运输中订单');
  }

  return {
    examples: [
      {
        id: 'signed-order',
        kind: 'order',
        label: '查询已签收订单',
        description: `示例订单 ${signedOrder.orderId}`,
        message: `查询订单 ${signedOrder.orderId}`,
        reference: signedOrder.orderId,
      },
      {
        id: 'shipping-order',
        kind: 'order',
        label: '查询运输中订单',
        description: `示例订单 ${shippingOrder.orderId}`,
        message: `查询订单 ${shippingOrder.orderId}`,
        reference: shippingOrder.orderId,
      },
      {
        id: 'logistics',
        kind: 'logistics',
        label: '查询物流轨迹',
        description: `示例物流 ${shippingOrder.trackingNo}`,
        message: `查询物流 ${shippingOrder.trackingNo}`,
        reference: shippingOrder.trackingNo,
      },
      {
        id: 'coupon',
        kind: 'coupon',
        label: '查询可用优惠券',
        description: '查看当前有效的全站优惠',
        message: '现在有什么可用优惠券',
        reference: 'available-coupons',
      },
    ],
  };
}
