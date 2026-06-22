# EcommerceAgent MVP Implementation Plan

> **For agentic workers:** Implement inline with test-driven development. Do not use multiple agents because Phase 1 explicitly forbids a multi-agent design.

**Goal:** Deliver a runnable JSON-backed Express and React ecommerce support MVP with DeepSeek tool calling.

**Architecture:** A thin React client calls an Express chat route. The backend owns deterministic safety checks, in-memory context, a bounded model/tool loop, and JSON-backed tools; only `llmService.ts` may call DeepSeek.

**Tech Stack:** Node.js, Express, TypeScript, Vitest, React, Vite, TailwindCSS, DeepSeek API.

---

### Task 1: Project foundation

- [ ] Add root TypeScript, Express, Vitest, environment, and script configuration.
- [ ] Add the Vite React TypeScript application and TailwindCSS configuration.
- [ ] Run type checks to prove both empty entry points compile.

### Task 2: JSON data access and domain types

- [ ] Write failing tests for valid reads, missing files, and path containment.
- [ ] Implement typed JSON reading rooted at `data/`.
- [ ] Define focused types matching the existing JSON fields.
- [ ] Run the focused tests, then the full suite.

### Task 3: Eight business tools

- [ ] Write failing behavior tests for product lookup and recommendation.
- [ ] Implement `getProduct` and `recommendProduct` minimally.
- [ ] Write failing behavior tests for order, logistics, coupon, FAQ, refund policy, and human handoff.
- [ ] Implement the remaining six tools using only JSON data.
- [ ] Verify successful, missing-input, and no-result behavior.

### Task 4: Registry and safety policy

- [ ] Write failing tests for schemas, dispatch, invalid arguments, forced handoff, and refusal.
- [ ] Implement the registry and deterministic safety classifier.
- [ ] Run `tests/edge_cases.json` as a data-driven policy test.

### Task 5: Model-independent chat workflow

- [ ] Write failing tests with a fake LLM for normal replies, one/multiple tool calls, missing identifiers, bounded loops, context reuse, and repeated failure handoff.
- [ ] Implement conversation memory and `chatService` against an LLM interface.
- [ ] Verify all workflow tests without network access.

### Task 6: DeepSeek decision and integration

- [ ] Present current official DeepSeek API/model choices to the user and wait for selection.
- [ ] Write failing adapter tests for `chat()`, `functionCalling()`, `stream()`, headers, endpoint, timeout, and error sanitization.
- [ ] Implement only `server/services/llmService.ts` and model configuration.
- [ ] Add an opt-in live smoke test guarded by `DEEPSEEK_API_KEY`.

### Task 7: Express routes

- [ ] Write failing HTTP tests for `/health`, valid `/chat`, validation errors, and safe upstream errors.
- [ ] Implement routes, middleware, and server bootstrap.
- [ ] Verify HTTP tests and TypeScript compilation.

### Task 8: React chat page

- [ ] Write failing component tests for rendering, submission, loading, errors, and keyboard behavior.
- [ ] Implement the four required components, API client, and message hook.
- [ ] Add minimal responsive Tailwind styling and automatic scrolling.
- [ ] Run component tests and the Vite production build.

### Task 9: Acceptance verification

- [ ] Run data integrity checks for all JSON associations.
- [ ] Run dataset-driven intent and edge-case tests.
- [ ] Run all unit/integration tests, both type checks, and the frontend build.
- [ ] Document setup, environment variables, commands, API examples, and known MVP limitations in `README.md`.
