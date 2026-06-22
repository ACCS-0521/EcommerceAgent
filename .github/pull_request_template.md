## 变更说明

<!-- 简要说明本 PR 修改了什么，以及为什么需要修改。 -->

## 影响范围

- [ ] Agent / Tool Calling
- [ ] Express API
- [ ] React UI
- [ ] Mock 数据
- [ ] 测试或文档

## 验证

- [ ] `pnpm test`
- [ ] `pnpm typecheck`
- [ ] `pnpm test:web`
- [ ] `pnpm build:web`

## 检查清单

- [ ] 业务数据仍全部来自 `data/`
- [ ] DeepSeek 调用仍统一经过 `server/services/llmService.ts`
- [ ] 未提交 `.env`、API Key 或真实用户数据
- [ ] 未引入数据库、登录、RAG、后台管理或多 Agent
