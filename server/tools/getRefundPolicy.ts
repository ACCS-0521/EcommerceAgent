import type { RefundPolicy } from '../types/RefundPolicy.js';
import type { ToolResult } from '../types/ToolResult.js';
import { readDataFile } from '../utils/fileReader.js';

export async function getRefundPolicy(input: {
  question: string;
}): Promise<ToolResult<RefundPolicy>> {
  if (!input.question.trim()) return { success: false, error: '请提供售后问题' };

  const policy = await readDataFile<RefundPolicy>('refund_policy.json');
  return { success: true, data: policy };
}
