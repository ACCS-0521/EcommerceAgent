import type { Logistics } from '../types/Logistics.js';
import type { ToolResult } from '../types/ToolResult.js';
import { readDataFile } from '../utils/fileReader.js';

export async function getLogistics(input: {
  trackingNo: string;
}): Promise<ToolResult<Logistics>> {
  const trackingNo = input.trackingNo.trim().toUpperCase();
  if (!trackingNo) return { success: false, error: '请提供物流单号' };

  const records = await readDataFile<Logistics[]>('logistics.json');
  const logistics = records.find((item) => item.trackingNo === trackingNo);
  return logistics
    ? { success: true, data: logistics }
    : { success: false, error: '未找到物流信息' };
}
