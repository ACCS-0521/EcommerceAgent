# EcommerceAgent

基于 DeepSeek Tool Calling 的智能电商客服 MVP。

## 功能

- 商品查询与推荐
- 订单、物流和优惠券查询
- FAQ 与售后规则查询
- 投诉、赔偿、法律、账号异常及连续失败转人工
- 提示词攻击、隐私和越权请求拒绝
- React 响应式聊天页面与内存多轮上下文
- JSON 动态生成的演示快捷入口，无需记忆订单号或物流号

所有业务数据均读取自 `data/`。项目不包含数据库、登录、JWT、RAG、后台管理或多 Agent。

## 环境要求

- Node.js 20+
- pnpm 10+
- DeepSeek API Key

复制 `.env.example` 为 `.env`，填写 API Key。默认模型为 `deepseek-v4-flash`，API 地址为 `https://api.deepseek.com`。

## 安装与启动

```bash
pnpm install
pnpm dev
```

另一个终端启动前端：

```bash
pnpm dev:web
```

访问 `http://localhost:5173`。

## API

健康检查：

```bash
curl http://localhost:3000/health
```

演示案例：

```bash
curl http://localhost:3000/demo/examples
```

聊天：

```bash
curl -X POST http://localhost:3000/chat \\
  -H 'Content-Type: application/json' \\
  -d '{"message":"查询订单 ORD202600001"}'
```

后续消息把响应中的 `conversationId` 原样传回即可保留本进程内上下文。

## 验证

```bash
pnpm test
pnpm typecheck
pnpm test:web
pnpm build:web
```

使用真实 DeepSeek API 验证 `tests/intent_cases.json`：

```bash
pnpm test:live-intents
```

`tests/edge_cases.json` 默认在离线测试中完整执行。真实意图测试会产生 API 用量，默认不随普通测试运行。

## MVP 限制

- 会话只保存在进程内，服务重启后丢失。
- `coupons.json` 没有用户绑定字段，因此当前返回全站可用且未过期的优惠券。
- DeepSeek Strict Tool Calling 仍属 Beta，本阶段使用标准 Tool Calling。
