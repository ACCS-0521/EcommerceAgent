import type { RefundPolicy } from '../types/RefundPolicy.js';
import { readDataFile } from '../utils/fileReader.js';

export async function transferToHuman(_input: Record<string, never>): Promise<{
  success: boolean;
  message: string;
  contact?: string;
  serviceHours?: string;
}> {
  const policy = await readDataFile<RefundPolicy>('refund_policy.json');
  if (!policy.artificialService.enabled) {
    return { success: false, message: '人工客服暂不可用' };
  }

  return {
    success: true,
    message: '已转接人工客服',
    contact: policy.artificialService.serviceId,
    serviceHours: policy.artificialService.serviceHours,
  };
}
