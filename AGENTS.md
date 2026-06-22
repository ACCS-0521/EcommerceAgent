# AGENTS.md

# 项目名称

EcommerceAgent

智能电商客服 Agent

------

# 项目目标

构建一个基于 DeepSeek V3 的智能电商客服系统。

第一阶段只完成 MVP。

支持：

- 商品咨询
- 商品推荐
- FAQ 问答
- 订单查询
- 物流查询
- 优惠券查询
- 售后规则查询
- 人工转接

优先保证系统跑通。

禁止过度设计。

------

# 技术栈

前端

- React
- Vite
- TypeScript
- TailwindCSS

后端

- Node.js
- Express
- TypeScript

模型

- DeepSeek V3

数据

- JSON 文件

Agent

- Function Calling

------

# 第一阶段禁止引入

不要实现：

- MongoDB
- MySQL
- Redis
- JWT
- 登录系统
- 注册系统
- 用户权限
- 后台管理系统
- RAG
- 向量数据库
- 多 Agent
- Docker
- 消息队列

先完成 MVP。

------

# 项目目录

```text
EcommerceAgent/

├── AGENTS.md

├── README.md
├── SYSTEM_PROMPT.md
├── TOOLS.md
├── WORKFLOW.md
├── MOCK_DATA.md
├── TEST_CASES.md
├── TODO.md

├── data/

│   ├── products.json
│   ├── orders.json
│   ├── users.json
│   ├── logistics.json
│   ├── coupons.json
│   ├── faq.json
│   ├── refund_policy.json
│   └── conversations.json

├── server/

│   ├── index.ts

│   ├── config/

│   │      env.ts
│   │      deepseek.ts

│   ├── services/

│   │      llmService.ts
│   │      chatService.ts

│   ├── agent/

│   │      systemPrompt.ts
│   │      workflow.ts
│   │      toolRegistry.ts

│   ├── tools/

│   │      getProduct.ts
│   │      recommendProduct.ts
│   │      getOrder.ts
│   │      getLogistics.ts
│   │      getCoupon.ts
│   │      transferToHuman.ts

│   ├── routes/

│   │      chat.ts
│   │      health.ts

│   ├── utils/

│   │      fileReader.ts
│   │      logger.ts

│   └── types/

│          Product.ts
│          Order.ts
│          User.ts
│          Logistics.ts

├── web/

│   ├── src/

│   │      pages/
│   │      components/
│   │      hooks/
│   │      api/
│   │      styles/

│   │      App.tsx
│   │      main.tsx

│   └── package.json

├── prompts/

│      system_prompt.txt
│      recommend_prompt.txt
│      human_handoff_prompt.txt

├── tests/

│      intent_cases.json
│      conversation_cases.json
│      edge_cases.json

├── .env

├── package.json

└── tsconfig.json
```

------

# Agent 身份

你是专业电商客服。

回答要求：

- 准确
- 简洁
- 礼貌

禁止编造。

------

# 禁止编造

禁止自行生成：

- 商品价格
- 库存
- 优惠券
- 订单状态
- 物流状态

必须调用 Tool 获取。

不知道时询问用户。

------

# 必须转人工

以下情况禁止自行处理：

- 投诉
- 愤怒用户
- 法律问题
- 金额争议
- 赔偿要求
- 账号异常
- 连续失败

调用：

transferToHuman()

------

# Tool

getProduct(productName)

返回：

- 商品信息
- 库存
- 价格
- 规格

------

recommendProduct(requirements)

根据用户需求推荐商品。

------

getOrder(orderId)

返回：

- 订单状态
- 支付状态
- 发货状态

------

getLogistics(trackingNo)

返回：

- 物流状态
- 物流轨迹
- 预计送达时间

------

getCoupon(userId)

返回：

- 优惠券
- 活动信息

------

transferToHuman()

返回：

- 人工客服联系方式

------

# 数据来源

禁止硬编码。

所有数据来自：

data/

products.json

orders.json

users.json

logistics.json

coupons.json

faq.json

refund_policy.json

conversations.json

------

# DeepSeek

创建：

services/llmService.ts

统一封装：

chat()

functionCalling()

stream()

禁止在业务代码直接调用 DeepSeek API。

所有模型调用统一经过：

llmService

方便未来切换 GPT。

------

# 工作流

用户问题

↓

大模型识别意图

↓

是否需要 Tool

↓

调用 Tool

↓

获取结果

↓

返回模型

↓

生成最终回复

------

# UI

风格：

ChatGPT 风格

简洁

白色

响应式

支持移动端

组件：

- ChatWindow
- MessageBubble
- InputBox
- TypingIndicator

------

# 编码规范

TypeScript 优先。

使用 async/await。

禁止超长文件。

一个文件只负责一个功能。

保持模块化。

代码必须可测试。

禁止重复代码。

禁止硬编码业务数据。

------

# MVP 必须完成

- React 聊天页面
- DeepSeek 接入
- 商品查询 Tool
- 商品推荐 Tool
- 订单查询 Tool
- 物流查询 Tool
- 优惠券 Tool
- 人工转接 Tool
- JSON Mock 数据

------

# 第二阶段

再加入：

- MongoDB
- JWT
- 用户系统
- 历史记录持久化

------

# 第三阶段

再加入：

- Embedding
- Qdrant
- RAG
- 知识库

------

# 第四阶段

再加入：

- 多 Agent

销售 Agent

售后 Agent

运营 Agent

主管 Agent

------

当前目标：

先完成 MVP。

先跑通，再优化。

禁止过度设计。