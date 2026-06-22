import { describe, expect, it } from 'vitest';

import { getCoupon } from '../server/tools/getCoupon.js';
import { getFaq } from '../server/tools/getFaq.js';
import { getLogistics } from '../server/tools/getLogistics.js';
import { getOrder } from '../server/tools/getOrder.js';
import { getProduct } from '../server/tools/getProduct.js';
import { getRefundPolicy } from '../server/tools/getRefundPolicy.js';
import { recommendProduct } from '../server/tools/recommendProduct.js';
import { transferToHuman } from '../server/tools/transferToHuman.js';

describe('business tools', () => {
  it('finds a product by a partial Chinese name', async () => {
    const result = await getProduct({ productName: '无线蓝牙耳机' });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.data).toMatchObject({
      id: 'P100001',
      price: 199,
      stock: 86,
      colors: ['黑色', '白色'],
    });
  });

  it('returns an explicit no-result response for an unknown product', async () => {
    const result = await getProduct({ productName: '不存在的冰箱' });

    expect(result).toEqual({ success: false, error: '未找到相关商品' });
  });

  it('recommends only matching in-stock products within the price ceiling', async () => {
    const result = await recommendProduct({ priceRange: 300, tags: ['运动', '降噪'] });

    expect(result.success).toBe(true);
    expect(result.products?.[0]).toMatchObject({ id: 'P100001', price: 199 });
    expect(result.products?.every((product) => product.price <= 300 && product.stock > 0)).toBe(true);
  });

  it('looks up an order only by its exact ID', async () => {
    const result = await getOrder({ orderId: 'ORD202600001' });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.data).toMatchObject({
      orderId: 'ORD202600001',
      trackingNo: 'SF202600001',
    });
    expect((await getOrder({ orderId: 'ORD999999999' })).success).toBe(false);
  });

  it('returns logistics history from the matching tracking number', async () => {
    const result = await getLogistics({ trackingNo: 'SF202600001' });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.data?.history.length).toBeGreaterThan(0);
  });

  it('returns only globally available unexpired coupons', async () => {
    const result = await getCoupon({ now: new Date('2026-06-22T00:00:00+08:00') });

    expect(result.success).toBe(true);
    expect(result.coupons).toHaveLength(18);
    expect(result.coupons?.some((coupon) => coupon.couponId === 'C10018')).toBe(false);
  });

  it('matches FAQ questions using configured keywords', async () => {
    const result = await getFaq({ question: '一般多久可以发货' });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.data?.id).toBe('FAQ001');
  });

  it('returns refund policy facts from refund_policy.json', async () => {
    const result = await getRefundPolicy({ question: '支持七天无理由吗' });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.data).toMatchObject({ sevenDaysReturn: true });
  });

  it('reads human-service contact and hours from refund policy data', async () => {
    const result = await transferToHuman({});

    expect(result).toEqual({
      success: true,
      message: '已转接人工客服',
      contact: 'service001',
      serviceHours: '09:00-21:00',
    });
  });
});
