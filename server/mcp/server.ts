import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createEcommerceMcpServer } from './ecommerceMcpServer.js';

const server = createEcommerceMcpServer();
const transport = new StdioServerTransport();

await server.connect(transport);
