import type { Coupon } from '../types/Coupon.js';
import { readDataFile } from '../utils/fileReader.js';

export interface GetCouponInput {
  userId?: string;
  now?: Date;
}

export async function getCoupon(input: GetCouponInput = {}): Promise<{
  success: boolean;
  coupons?: Coupon[];
  error?: string;
}> {
  const coupons = await readDataFile<Coupon[]>('coupons.json');
  const today = (input.now ?? new Date()).toISOString().slice(0, 10);
  const available = coupons.filter(
    (coupon) => coupon.available && coupon.expireTime >= today,
  );

  return available.length > 0
    ? { success: true, coupons: available }
    : { success: false, error: '暂无可用优惠券' };
}
