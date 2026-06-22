import { describe, expect, it } from 'vitest';

import { readDataFile } from '../server/utils/fileReader.js';

describe('readDataFile', () => {
  it('reads and parses a JSON file from the data directory', async () => {
    const products = await readDataFile<Array<{ id: string }>>('products.json');

    expect(products).toHaveLength(20);
    expect(products[0]?.id).toBe('P100001');
  });

  it('rejects paths outside the data directory', async () => {
    await expect(readDataFile('../AGENTS.md')).rejects.toThrow(
      'Data file must stay inside the data directory',
    );
  });

  it('reports a missing data file without inventing a value', async () => {
    await expect(readDataFile('missing.json')).rejects.toThrow(
      'Unable to read data file: missing.json',
    );
  });
});
