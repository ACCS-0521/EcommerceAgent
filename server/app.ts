import cors from 'cors';
import express, { type Express } from 'express';

import { createChatRouter, type ChatServiceLike } from './routes/chat.js';
import { createDemoRouter } from './routes/demo.js';
import { createHealthRouter } from './routes/health.js';

export function createApp(options: { chatService: ChatServiceLike }): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json({ limit: '32kb' }));
  app.use(createHealthRouter());
  app.use(createDemoRouter());
  app.use(createChatRouter(options.chatService));
  return app;
}
