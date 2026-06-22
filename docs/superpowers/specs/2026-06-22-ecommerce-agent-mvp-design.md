# EcommerceAgent MVP Design

## Scope

Build the first working phase of a Chinese ecommerce customer-service assistant. The MVP supports product lookup and recommendation, order and logistics lookup, coupon lookup, FAQ and refund-policy answers, and mandatory human handoff. It explicitly excludes databases, authentication, RAG, admin systems, Docker, queues, and multiple agents.

## Architecture

The React client sends a message and optional conversation ID to `POST /chat`. Express delegates to a chat service that applies deterministic safety rules, supplies in-memory conversation context to the model, executes model-requested tools through a registry, and asks the model to compose the final answer from tool output. All model traffic is isolated in `server/services/llmService.ts`.

Business tools are pure JSON-facing functions backed only by files under `data/`. Tools never write customer-facing prose. `transferToHuman` reads contact details from `refund_policy.json`, so its business response is not hardcoded.

## Backend boundaries

- `config`: environment and model-client configuration.
- `utils/fileReader.ts`: typed JSON loading rooted at `data/`.
- `tools`: one file per tool, returning a common success/error result.
- `agent/toolRegistry.ts`: tool schemas, argument validation, and dispatch.
- `agent/safetyPolicy.ts`: mandatory handoff and refusal rules.
- `services/llmService.ts`: `chat()`, `functionCalling()`, and `stream()` only.
- `services/chatService.ts`: conversation context and bounded tool-call loop.
- `routes`: `/health` and `/chat` HTTP contracts.

## Data behavior

Product lookup supports partial product name, category, and ID matching. Recommendation filters by optional price ceiling and requirement keywords, excludes out-of-stock items, and ranks matches without inventing attributes. Orders and logistics require exact identifiers. FAQ uses normalized keyword/question matching. Refund policy returns only matching policy fields.

The coupon dataset has no user assignment field. For this MVP, `userId` is optional and the tool returns globally available, unexpired coupons. This does not imply authentication or personalized eligibility.

## Safety and context

Complaints, anger, compensation, legal issues, account issues, explicit human-service requests, and repeated failures route directly to `transferToHuman`. Prompt extraction, secret requests, third-party private-data requests, and unauthorized mutations are refused before model execution. Conversation state is process memory only and is lost on restart.

## HTTP contract

`POST /chat` accepts `{ "message": string, "conversationId"?: string }`. It returns `{ "conversationId": string, "message": string, "intent"?: string, "toolCalls": string[] }`. Invalid input returns 400; known upstream failures return a safe 502/504 response without secrets. `GET /health` returns service health without contacting DeepSeek.

## UI brief

Use a simple white ChatGPT-like single-page layout. Implement `ChatWindow`, `MessageBubble`, `InputBox`, and `TypingIndicator`, with responsive mobile behavior, keyboard submission, disabled/loading states, visible errors, and automatic scrolling. No navigation, account controls, dashboard, or decorative feature expansion.

## Verification

Vitest covers file reading, every tool, registry dispatch, safety decisions, conversation behavior with a fake LLM, and HTTP validation. Dataset-driven checks consume `tests/intent_cases.json` and `tests/edge_cases.json`. A live DeepSeek smoke test is optional and only runs when an API key is supplied. Type checks and the frontend production build are required before completion.

## DeepSeek decision gate

Before implementing the live model client configuration, present the current official DeepSeek API/model choices, compatibility, and deprecation information to the user. Do not choose the final model on the user's behalf.
