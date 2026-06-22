import { Router } from 'express';
import { z } from 'zod';

import type { ChatRequest, ChatResult } from '../services/chatService.js';

export interface ChatServiceLike {
  send(request: ChatRequest): Promise<ChatResult>;
}

const bodySchema = z.object({
  message: z.string().trim().min(1),
  conversationId: z.string().trim().min(1).optional(),
});

export function createChatRouter(chatService: ChatServiceLike): Router {
  const router = Router();

  router.post('/chat', async (request, response) => {
    const parsed = bodySchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: '请输入消息' });
      return;
    }

    try {
      const chatRequest: ChatRequest = { message: parsed.data.message };
      if (parsed.data.conversationId) {
        chatRequest.conversationId = parsed.data.conversationId;
      }
      response.json(await chatService.send(chatRequest));
    } catch {
      response.status(502).json({ error: '客服服务暂时不可用，请稍后重试' });
    }
  });

  return router;
}
