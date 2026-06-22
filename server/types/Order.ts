export interface Order {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  amount: number;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  trackingNo: string;
  createTime: string;
}
