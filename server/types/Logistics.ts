export interface LogisticsEvent {
  time: string;
  content: string;
}

export interface Logistics {
  trackingNo: string;
  company: string;
  status: string;
  estimatedArrival: string;
  history: LogisticsEvent[];
}
