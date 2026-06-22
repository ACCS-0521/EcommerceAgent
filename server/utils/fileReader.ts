import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../data',
);

export async function readDataFile<T>(fileName: string): Promise<T> {
  const filePath = path.resolve(dataDirectory, fileName);
  const relativePath = path.relative(dataDirectory, filePath);

  if (
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath) ||
    path.extname(filePath) !== '.json'
  ) {
    throw new Error('Data file must stay inside the data directory');
  }

  try {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Unable to read data file: ${fileName}`, { cause: error });
  }
}
