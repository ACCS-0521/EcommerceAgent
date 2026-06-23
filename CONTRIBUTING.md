# Contributing

感谢你愿意改进 EcommerceAgent。这个项目当前目标是先跑通智能电商客服 MVP，因此贡献也应保持小而清晰，避免把第二、三、四阶段能力提前塞进来。

## 开发原则

- 不引入数据库、登录系统、JWT、RAG、后台管理、多 Agent、Docker 或消息队列。
- 所有业务数据从 `data/` 读取，禁止在业务代码中硬编码商品、订单、物流、优惠券或售后结果。
- 所有大模型调用必须统一经过 `server/services/llmService.ts`。
- Tool 需要可测试，错误返回要明确、可解释。
- UI 以简洁可用为主，不为了视觉效果牺牲 MVP 稳定性。

## 本地开发

```bash
pnpm install
cp .env.example .env
```

在 `.env` 中配置自己的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-v4-flash
```

不要提交 `.env`、API Key、真实订单、真实用户数据或本地调试日志。

启动后端：

```bash
pnpm dev
```

启动前端：

```bash
pnpm dev:web
```

## 提交前检查

请尽量在提交前运行：

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm test:web
pnpm build:web
```

普通测试不会调用真实 DeepSeek API。只有 `pnpm test:live-intents` 会使用真实模型服务并产生 API 用量。

## Pull Request 规范

PR 请尽量保持一个清晰主题，并说明：

- 修改了什么；
- 为什么需要修改；
- 如何验证；
- 是否影响 DeepSeek 配置、Tool 行为、Mock 数据或前端交互。

如果 PR 修改了 `data/`、Tool schema、系统提示词或安全策略，请同步补充或更新测试用例。

## Issue 规范

提交 Bug 时，请尽量提供：

- 复现步骤；
- 期望结果和实际结果；
- 运行环境；
- 已脱敏的错误日志或截图。

安全问题、密钥泄露和隐私数据暴露请不要发公开 Issue，请阅读 [SECURITY.md](SECURITY.md)。
