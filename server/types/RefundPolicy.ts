export interface RefundPolicy {
  version: string;
  effectiveDate: string;
  sevenDaysReturn: boolean;
  sevenDaysReturnDescription: string;
  qualityProblemShippingFee: {
    sellerPays: boolean;
    description: string;
  };
  nonQualityProblemShippingFee: {
    sellerPays: boolean;
    description: string;
  };
  refundTime: {
    minDays: number;
    maxDays: number;
    description: string;
  };
  openedProductReturn: {
    allowed: boolean;
    description: string;
  };
  exchangePolicy: {
    supported: boolean;
    description: string;
  };
  warrantyPolicy: {
    supported: boolean;
    defaultWarrantyMonths: number;
    description: string;
  };
  nonReturnableCategories: string[];
  refundReasons: Array<{
    code: string;
    name: string;
    allowReturn: boolean;
    allowExchange: boolean;
  }>;
  artificialService: {
    enabled: boolean;
    serviceId: string;
    serviceHours: string;
  };
}
