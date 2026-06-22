import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';

describe('chat page', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('renders the customer-service welcome state', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'EcommerceAgent' })).toBeInTheDocument();
    expect(screen.getByText('您好，我是智能电商客服。请问有什么可以帮您？')).toBeInTheDocument();
  });

  it('sends a message and renders the assistant reply', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => ({
      ok: true,
      json: async () =>
        url === '/demo/examples'
          ? { examples: [] }
          : {
              conversationId: 'conversation-1',
              message: '这款耳机支持 iPhone。',
              toolCalls: ['getProduct'],
            },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox'), '耳机支持苹果吗');
    await user.click(screen.getByRole('button', { name: '发送' }));

    expect(await screen.findByText('这款耳机支持 iPhone。')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: '耳机支持苹果吗' }),
      }),
    );
  });

  it('loads a JSON-backed demo example and sends it with one click', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => ({
      ok: true,
      json: async () =>
        url === '/demo/examples'
          ? {
              examples: [
                {
                  id: 'signed-order',
                  kind: 'order',
                  label: '查询已签收订单',
                  description: '示例订单 ORD-DYNAMIC',
                  message: '查询订单 ORD-DYNAMIC',
                  reference: 'ORD-DYNAMIC',
                },
              ],
            }
          : {
              conversationId: 'conversation-1',
              message: '订单已签收。',
              toolCalls: ['getOrder'],
            },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: '查询已签收订单' }));

    expect(await screen.findByText('订单已签收。')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/chat',
      expect.objectContaining({ body: JSON.stringify({ message: '查询订单 ORD-DYNAMIC' }) }),
    );
  });
});
