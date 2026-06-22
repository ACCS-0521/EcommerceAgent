import type { Product } from '../types/Product.js';
import { readDataFile } from '../utils/fileReader.js';

export interface RecommendProductInput {
  priceRange?: number;
  tags?: string[];
  requirements?: string;
}

export interface RecommendProductResult {
  success: boolean;
  products?: Product[];
  error?: string;
}

export async function recommendProduct(
  input: RecommendProductInput,
): Promise<RecommendProductResult> {
  const requirements = [input.requirements ?? '', ...(input.tags ?? [])]
    .map((value) => value.trim().toLocaleLowerCase('zh-CN'))
    .filter(Boolean);
  const products = await readDataFile<Product[]>('products.json');

  const ranked = products
    .filter((product) => product.stock > 0)
    .filter((product) => input.priceRange === undefined || product.price <= input.priceRange)
    .map((product) => {
      const searchable = [
        product.name,
        product.category,
        product.description,
        ...product.tags,
        ...product.faq,
      ]
        .join(' ')
        .toLocaleLowerCase('zh-CN');
      const score = requirements.filter((term) => searchable.includes(term)).length;
      return { product, score };
    })
    .filter(({ score }) => requirements.length === 0 || score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.product.rating - left.product.rating ||
        right.product.sales - left.product.sales,
    )
    .slice(0, 5)
    .map(({ product }) => product);

  return ranked.length > 0
    ? { success: true, products: ranked }
    : { success: false, error: '未找到符合条件的商品' };
}
