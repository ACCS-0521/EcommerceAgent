export interface Coupon {
  couponId: string;
  name: string;
  discount: number;
  minAmount: number;
  expireTime: string;
  available: boolean;
}
