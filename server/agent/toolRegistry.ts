import { z } from 'zod';

import { getCoupon } from '../tools/getCoupon.js';
import { getFaq } from '../tools/getFaq.js';
import { getLogistics } from '../tools/getLogistics.js';
import { getOrder } from '../tools/getOrder.js';
import { getProduct } from '../tools/getProduct.js';
import { getRefundPolicy } from '../tools/getRefundPolicy.js';
import { recommendProduct } from '../tools/recommendProduct.js';
import { transferToHuman } from '../tools/transferToHuman.js';

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export const toolDefinitions: ToolDefinition[] = [
  definition('getProduct', '查询商品信息、价格、库存、颜色和规格', {
    productName: stringProperty('商品名称、类别或商品 ID'),
  }, ['productName']),
  definition('recommendProduct', '根据预算和需求推荐有库存的商品', {
    priceRange: { type: 'number', description: '最高预算，可省略' },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description: '用途、品类或功能关键词，可省略',
    },
    requirements: stringProperty('用户的自然语言需求，可省略'),
  }),
  definition('getOrder', '根据订单号查询订单状态', {
    orderId: stringProperty('订单号，例如 ORD202600001'),
  }, ['orderId']),
  definition('getLogistics', '根据物流单号查询物流状态和轨迹', {
    trackingNo: stringProperty('物流单号，例如 SF202600001'),
  }, ['trackingNo']),
  definition('getCoupon', '查询当前可用的全站优惠券', {
    userId: stringProperty('可选用户 ID；MVP 数据不包含用户券绑定'),
  }),
  definition('getFaq', '查询标准 FAQ 答案', {
    question: stringProperty('用户问题'),
  }, ['question']),
  definition('getRefundPolicy', '查询退款、退货、运费、换货或质保规则', {
    question: stringProperty('售后规则问题'),
  }, ['question']),
  definition('transferToHuman', '将必须人工处理的问题转接人工客服', {}),
];

const schemas = {
  getProduct: z.object({ productName: z.string().trim().min(1) }),
  recommendProduct: z.object({
    priceRange: z.number().positive().optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
    requirements: z.string().trim().min(1).optional(),
  }),
  getOrder: z.object({ orderId: z.string().trim().min(1) }),
  getLogistics: z.object({ trackingNo: z.string().trim().min(1) }),
  getCoupon: z.object({ userId: z.string().trim().min(1).optional() }),
  getFaq: z.object({ question: z.string().trim().min(1) }),
  getRefundPolicy: z.object({ question: z.string().trim().min(1) }),
  transferToHuman: z.object({}),
};

export type ToolName = keyof typeof schemas;

export async function executeTool(name: string, argumentsValue: unknown): Promise<unknown> {
  if (!(name in schemas)) throw new Error(`未注册的工具: ${name}`);

  const toolName = name as ToolName;
  const result = schemas[toolName].safeParse(argumentsValue);
  if (!result.success) throw new Error(`工具参数无效: ${name}`);

  switch (toolName) {
    case 'getProduct':
      return getProduct(schemas.getProduct.parse(argumentsValue));
    case 'recommendProduct':
      return recommendProduct(schemas.recommendProduct.parse(argumentsValue));
    case 'getOrder':
      return getOrder(schemas.getOrder.parse(argumentsValue));
    case 'getLogistics':
      return getLogistics(schemas.getLogistics.parse(argumentsValue));
    case 'getCoupon':
      return getCoupon(schemas.getCoupon.parse(argumentsValue));
    case 'getFaq':
      return getFaq(schemas.getFaq.parse(argumentsValue));
    case 'getRefundPolicy':
      return getRefundPolicy(schemas.getRefundPolicy.parse(argumentsValue));
    case 'transferToHuman':
      return transferToHuman(schemas.transferToHuman.parse(argumentsValue));
  }
}

function definition(
  name: string,
  description: string,
  properties: Record<string, unknown>,
  required: string[] = [],
): ToolDefinition {
  return {
    type: 'function',
    function: {
      name,
      description,
      parameters: {
        type: 'object',
        properties,
        required,
        additionalProperties: false,
      },
    },
  };
}

function stringProperty(description: string): Record<string, string> {
  return { type: 'string', description };
}
