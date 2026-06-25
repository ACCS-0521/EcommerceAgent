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

export interface ToolSpec<Name extends string = string> {
  name: Name;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  parameters: Record<string, unknown>;
  required: string[];
  execute: (input: unknown) => Promise<unknown>;
}

export const toolSpecs = [
  spec(
    'getProduct',
    '查询商品信息、价格、库存、颜色和规格',
    { productName: z.string().trim().min(1).describe('商品名称、类别或商品 ID') },
    { productName: stringProperty('商品名称、类别或商品 ID') },
    ['productName'],
    getProduct,
  ),
  spec(
    'recommendProduct',
    '根据预算和需求推荐有库存的商品',
    {
      priceRange: z.number().positive().optional().describe('最高预算，可省略'),
      tags: z.array(z.string().trim().min(1)).optional().describe('用途、品类或功能关键词，可省略'),
      requirements: z.string().trim().min(1).optional().describe('用户的自然语言需求，可省略'),
    },
    {
      priceRange: { type: 'number', description: '最高预算，可省略' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: '用途、品类或功能关键词，可省略',
      },
      requirements: stringProperty('用户的自然语言需求，可省略'),
    },
    [],
    recommendProduct,
  ),
  spec(
    'getOrder',
    '根据订单号查询订单状态',
    { orderId: z.string().trim().min(1).describe('订单号，例如 ORD202600001') },
    { orderId: stringProperty('订单号，例如 ORD202600001') },
    ['orderId'],
    getOrder,
  ),
  spec(
    'getLogistics',
    '根据物流单号查询物流状态和轨迹',
    { trackingNo: z.string().trim().min(1).describe('物流单号，例如 SF202600001') },
    { trackingNo: stringProperty('物流单号，例如 SF202600001') },
    ['trackingNo'],
    getLogistics,
  ),
  spec(
    'getCoupon',
    '查询当前可用的全站优惠券',
    { userId: z.string().trim().min(1).optional().describe('可选用户 ID；MVP 数据不包含用户券绑定') },
    { userId: stringProperty('可选用户 ID；MVP 数据不包含用户券绑定') },
    [],
    getCoupon,
  ),
  spec(
    'getFaq',
    '查询标准 FAQ 答案',
    { question: z.string().trim().min(1).describe('用户问题') },
    { question: stringProperty('用户问题') },
    ['question'],
    getFaq,
  ),
  spec(
    'getRefundPolicy',
    '查询退款、退货、运费、换货或质保规则',
    { question: z.string().trim().min(1).describe('售后规则问题') },
    { question: stringProperty('售后规则问题') },
    ['question'],
    getRefundPolicy,
  ),
  spec(
    'transferToHuman',
    '将必须人工处理的问题转接人工客服',
    {},
    {},
    [],
    transferToHuman,
  ),
] as const satisfies readonly ToolSpec[];

export type ToolName = (typeof toolSpecs)[number]['name'];

export const toolDefinitions: ToolDefinition[] = toolSpecs.map((tool) => ({
  type: 'function',
  function: {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'object',
      properties: tool.parameters,
      required: tool.required,
      additionalProperties: false,
    },
  },
}));

export async function executeCatalogTool(
  name: string,
  argumentsValue: unknown,
): Promise<unknown> {
  const tool = toolSpecs.find((item) => item.name === name);
  if (!tool) throw new Error(`未注册的工具: ${name}`);

  const schema = z.object(tool.inputSchema);
  const result = schema.safeParse(argumentsValue);
  if (!result.success) throw new Error(`工具参数无效: ${name}`);

  return tool.execute(result.data);
}

function spec<Name extends string>(
  name: Name,
  description: string,
  inputSchema: Record<string, z.ZodTypeAny>,
  properties: Record<string, unknown>,
  required: string[],
  execute: (input: never) => Promise<unknown>,
): ToolSpec<Name> {
  return {
    name,
    description,
    inputSchema,
    parameters: properties,
    required,
    execute: execute as (input: unknown) => Promise<unknown>,
  };
}

function stringProperty(description: string): Record<string, string> {
  return { type: 'string', description };
}
