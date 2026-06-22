# TODO.md

# 当前阶段

Phase 1

目标：

完成 MVP。

优先跑通系统。

禁止过度设计。

------

# 优先级 P0

必须完成

## 1. 初始化项目

创建：

server/

web/

data/

docs/

完成 React + Vite + TypeScript 初始化。

完成 Express + TypeScript 初始化。

------

## 2. DeepSeek 接入

创建：

services/

llmService.ts

统一封装：

chat()

stream()

functionCalling()

禁止在业务代码直接调用模型。

------

## 3. 聊天接口

创建：

routes/chat.ts

实现：

POST /chat

接收：

message

返回：

assistant response

------

## 4. React 聊天页面

组件：

ChatWindow

MessageBubble

InputBox

TypingIndicator

支持：

发送消息

显示消息

滚动到底部

------

## 5. Tool Registry

创建：

agent/

toolRegistry.ts

注册：

getProduct

recommendProduct

getOrder

getLogistics

getCoupon

getFaq

getRefundPolicy

transferToHuman

------

## 6. 实现 Tool

tools/

getProduct.ts

recommendProduct.ts

getOrder.ts

getLogistics.ts

getCoupon.ts

getFaq.ts

getRefundPolicy.ts

transferToHuman.ts

所有数据读取：

data/

目录。

禁止硬编码。

------

## 7. 完成 Function Calling

工作流：

用户问题

↓

模型分析

↓

调用 Tool

↓

返回结果

↓

生成最终回复

------

## 8. Mock 数据

生成：

products.json

orders.json

users.json

logistics.json

coupons.json

faq.json

refund_policy.json

conversations.json

------

# 优先级 P1

完成基础体验

## 支持流式输出

stream()

实现打字效果。

------

## 历史消息

保存在内存。

支持多轮对话。

------

## 上下文记忆

不要重复询问订单号。

支持连续提问。

------

## Loading 动画

TypingIndicator

------

## 错误处理

模型失败

Tool失败

超时

空结果

------

# 优先级 P2

优化

## 日志系统

logger.ts

记录：

请求

响应

错误

耗时

------

## 配置文件

env.ts

统一读取：

API_KEY

PORT

MODEL

BASE_URL

------

## 类型定义

types/

Product.ts

Order.ts

User.ts

Logistics.ts

------

# 当前禁止实现

MongoDB

MySQL

Redis

JWT

登录系统

注册系统

管理员后台

支付系统

RAG

Embedding

Qdrant

Redis

多 Agent

Docker

消息队列

部署

------

# 第二阶段

MongoDB

JWT

历史记录持久化

用户系统

------

# 第三阶段

Embedding

Qdrant

RAG

知识库

------

# 第四阶段

多 Agent

销售 Agent

售后 Agent

运营 Agent

主管 Agent

------

# 当前目标

优先完成 MVP。

先跑通。

不要过度设计。

不要提前优化。