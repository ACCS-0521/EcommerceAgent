export interface DemoExample {
  id: string;
  kind: 'order' | 'logistics' | 'coupon';
  label: string;
  description: string;
  message: string;
  reference: string;
}

export async function getDemoExamples(): Promise<DemoExample[]> {
  const response = await fetch('/demo/examples');
  if (!response.ok) return [];
  const payload = (await response.json()) as { examples?: DemoExample[] };
  return payload.examples ?? [];
}
