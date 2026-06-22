import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

import { evaluateSafetyPolicy } from '../server/agent/safetyPolicy.js';

interface EdgeCase {
  id: string;
  input: string;
  expectedIntent: string;
  expectedAction: 'transferToHuman' | 'refuse';
}

const cases = JSON.parse(
  await readFile(new URL('./edge_cases.json', import.meta.url), 'utf8'),
) as EdgeCase[];

describe('evaluateSafetyPolicy', () => {
  it.each(cases)('$id classifies "$input"', ({ input, expectedIntent, expectedAction }) => {
    expect(evaluateSafetyPolicy(input)).toEqual({
      intent: expectedIntent,
      action: expectedAction,
    });
  });

  it('allows an ordinary product question to reach the model workflow', () => {
    expect(evaluateSafetyPolicy('这个耳机支持苹果手机吗')).toBeNull();
  });
});
