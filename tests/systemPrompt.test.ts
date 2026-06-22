import { describe, expect, it } from 'vitest';

import { getSystemPrompt } from '../server/agent/systemPrompt.js';

describe('system prompt', () => {
  it('requires plain-text customer replies for the lightweight chat UI', async () => {
    await expect(getSystemPrompt()).resolves.toContain('最终回复使用纯文本，不要使用 Markdown');
  });
});
