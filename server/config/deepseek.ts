import OpenAI from 'openai';

import type { LlmConfig } from '../services/llmService.js';

export function createDeepSeekClient(config: LlmConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
    timeout: config.timeoutMs,
    maxRetries: 1,
  });
}
