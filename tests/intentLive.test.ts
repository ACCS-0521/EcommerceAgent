import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

import { loadConfig } from '../server/config/env.js';
import { createLlmService } from '../server/services/llmService.js';

interface IntentCase {
  id: string;
  input: string;
  expectedIntent: string;
}

const enabled = process.env.RUN_LIVE_DEEPSEEK_TESTS === '1';

describe.skipIf(!enabled)('DeepSeek intent validation', () => {
  it(
    'classifies intent_cases.json using the configured model',
    async () => {
      const cases = JSON.parse(
        await readFile(new URL('./intent_cases.json', import.meta.url), 'utf8'),
      ) as IntentCase[];
      const allowed = [...new Set(cases.map((item) => item.expectedIntent))];
      const service = createLlmService(loadConfig().deepSeek);
      const result = await service.chat([
        {
          role: 'system',
          content:
            '你是意图分类器。只输出合法 JSON 数组，不要 Markdown。每项格式为 {"id":"...","intent":"..."}。intent 只能取：' +
            allowed.join(', '),
        },
        {
          role: 'user',
          content: JSON.stringify(cases.map(({ id, input }) => ({ id, input }))),
        },
      ]);
      const actual = JSON.parse(result.content ?? '[]') as Array<{
        id: string;
        intent: string;
      }>;

      expect(actual).toEqual(
        cases.map(({ id, expectedIntent }) => ({ id, intent: expectedIntent })),
      );
    },
    60_000,
  );
});
