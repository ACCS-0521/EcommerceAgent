import { describe, expect, it, vi } from 'vitest';

import {
  createLlmService,
  type LlmTransport,
} from '../server/services/llmService.js';

const config = {
  apiKey: 'test-key',
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-v4-flash',
  timeoutMs: 15_000,
};

describe('llmService', () => {
  it('uses the configured model and disables thinking for chat', async () => {
    const complete = vi.fn().mockResolvedValue({ content: '您好', toolCalls: [] });
    const service = createLlmService(config, transport({ complete }));

    const result = await service.chat([{ role: 'user', content: '你好' }]);

    expect(result.content).toBe('您好');
    expect(complete).toHaveBeenCalledWith({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: '你好' }],
      thinking: { type: 'disabled' },
    });
  });

  it('passes registered tools through functionCalling', async () => {
    const complete = vi.fn().mockResolvedValue({
      content: null,
      toolCalls: [
        { id: 'call-1', name: 'getOrder', arguments: '{"orderId":"ORD202600001"}' },
      ],
    });
    const service = createLlmService(config, transport({ complete }));
    const tools = [
      {
        type: 'function' as const,
        function: {
          name: 'getOrder',
          description: '查询订单',
          parameters: { type: 'object' },
        },
      },
    ];

    const result = await service.functionCalling(
      [{ role: 'user', content: '查订单' }],
      tools,
    );

    expect(result.toolCalls[0]?.name).toBe('getOrder');
    expect(complete).toHaveBeenCalledWith({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: '查订单' }],
      thinking: { type: 'disabled' },
      tools,
      toolChoice: 'auto',
    });
  });

  it('yields text chunks from stream', async () => {
    const stream = vi.fn(async function* () {
      yield '你';
      yield '好';
    });
    const service = createLlmService(config, transport({ stream }));

    const chunks: string[] = [];
    for await (const chunk of service.stream([{ role: 'user', content: '你好' }])) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['你', '好']);
    expect(stream).toHaveBeenCalledWith({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: '你好' }],
      thinking: { type: 'disabled' },
    });
  });
});

function transport(overrides: Partial<LlmTransport>): LlmTransport {
  return {
    complete: async () => ({ content: '', toolCalls: [] }),
    stream: async function* () {},
    ...overrides,
  };
}
