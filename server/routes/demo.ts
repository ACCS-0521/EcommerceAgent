import { Router } from 'express';

import { getDemoExamples } from '../services/demoService.js';

export function createDemoRouter(): Router {
  const router = Router();

  router.get('/demo/examples', async (_request, response) => {
    try {
      response.json(await getDemoExamples());
    } catch {
      response.status(500).json({ error: '演示数据暂时不可用' });
    }
  });

  return router;
}
