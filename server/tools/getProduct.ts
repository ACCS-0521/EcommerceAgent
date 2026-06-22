import type { Product } from '../types/Product.js';
import type { ToolResult } from '../types/ToolResult.js';
import { readDataFile } from '../utils/fileReader.js';

export interface GetProductInput {
  productName: string;
}

export async function getProduct(
  input: GetProductInput,
): Promise<ToolResult<Product>> {
  const query = input.productName.trim().toLocaleLowerCase('zh-CN');
  if (!query) return { success: false, error: '请提供商品名称' };

  const products = await readDataFile<Product[]>('products.json');
  const product = products.find((item) => {
    const searchable = [
      item.id,
      item.name,
      item.category,
      item.brand,
      item.description,
      ...item.tags,
      ...item.faq,
    ]
      .join(' ')
      .toLocaleLowerCase('zh-CN');
    return searchable.includes(query);
  });

  return product
    ? { success: true, data: product }
    : { success: false, error: '未找到相关商品' };
}
