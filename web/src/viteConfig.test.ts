// @vitest-environment node

import { describe, expect, it } from 'vitest';

import config from '../vite.config';

describe('Vite development proxy', () => {
  it('forwards both chat and demo API routes to Express', () => {
    expect(config).toMatchObject({
      server: {
        proxy: {
          '/chat': 'http://localhost:3000',
          '/demo': 'http://localhost:3000',
        },
      },
    });
  });
});
