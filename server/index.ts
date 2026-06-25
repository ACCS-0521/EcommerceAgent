import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { createChatService } from './services/chatService.js';
import { createLlmService } from './services/llmService.js';
import { createInMemoryMcpToolExecutor } from './mcp/mcpToolExecutor.js';
import { logger } from './utils/logger.js';

const config = loadConfig();
const llm = createLlmService(config.deepSeek);
const toolExecutor = await createInMemoryMcpToolExecutor();
const chatService = createChatService({ llm, toolExecutor });
const app = createApp({ chatService });

app.listen(config.port, () => {
  logger.info(`EcommerceAgent listening on http://localhost:${config.port}`);
});
