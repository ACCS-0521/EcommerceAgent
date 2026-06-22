export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  colors: string[];
  specifications: Record<string, string>;
  tags: string[];
  description: string;
  faq: string[];
}
