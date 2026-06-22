import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { createApp } from '../server/app.js';

describe('Express API', () => {
  it('reports health without calling the model', async () => {
    const send = vi.fn();
    const response = await request(createApp({ chatService: { send } })).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'EcommerceAgent' });
    expect(send).not.toHaveBeenCalled();
  });

  it('returns JSON-backed demo examples without calling the model', async () => {
    const send = vi.fn();
    const response = await request(createApp({ chatService: { send } })).get(
      '/demo/examples',
    );

    expect(response.status).toBe(200);
    expect(response.body.examples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'order' }),
        expect.objectContaining({ kind: 'logistics' }),
        expect.objectContaining({ kind: 'coupon' }),
      ]),
    );
    expect(send).not.toHaveBeenCalled();
  });

  it('returns a chat response', async () => {
    const send = vi.fn().mockResolvedValue({
      conversationId: 'conversation-1',
      message: '您好',
      toolCalls: [],
    });
    const response = await request(createApp({ chatService: { send } }))
      .post('/chat')
      .send({ message: '你好' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('您好');
    expect(send).toHaveBeenCalledWith({ message: '你好' });
  });

  it('rejects an empty message', async () => {
    const send = vi.fn();
    const response = await request(createApp({ chatService: { send } }))
      .post('/chat')
      .send({ message: '   ' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: '请输入消息' });
    expect(send).not.toHaveBeenCalled();
  });

  it('does not expose upstream error details', async () => {
    const send = vi.fn().mockRejectedValue(new Error('secret upstream detail'));
    const response = await request(createApp({ chatService: { send } }))
      .post('/chat')
      .send({ message: '你好' });

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: '客服服务暂时不可用，请稍后重试' });
    expect(response.text).not.toContain('secret upstream detail');
  });
});
