import { randomUUID } from 'node:crypto';

import { evaluateSafetyPolicy } from '../agent/safetyPolicy.js';
import { getSystemPrompt } from '../agent/systemPrompt.js';
import {
  executeTool,
  toolDefinitions,
  type ToolName,
} from '../agent/toolRegistry.js';
import { transferToHuman } from '../tools/transferToHuman.js';
import type { LlmMessage, LlmService } from './llmService.js';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResult {
  conversationId: string;
  message: string;
  intent?: string;
  toolCalls: string[];
}

interface ConversationState {
  messages: LlmMessage[];
  failedToolResults: number;
}

export function createChatService(options: {
  llm: LlmService;
  maxToolRounds?: number;
}) {
  const conversations = new Map<string, ConversationState>();
  const maxToolRounds = options.maxToolRounds ?? 4;

  return {
    async send(request: ChatRequest): Promise<ChatResult> {
      const conversationId = request.conversationId ?? randomUUID();
      const state = conversations.get(conversationId) ?? {
        messages: [],
        failedToolResults: 0,
      };
      conversations.set(conversationId, state);

      const safety = evaluateSafetyPolicy(request.message);
      if (safety?.action === 'refuse') {
        const message = '抱歉，我无法提供相关信息。';
        remember(state, request.message, message);
        return { conversationId, message, intent: safety.intent, toolCalls: [] };
      }

      if (safety?.action === 'transferToHuman') {
        const handoff = await transferToHuman({});
        const message = formatHandoff(handoff);
        remember(state, request.message, message);
        return {
          conversationId,
          message,
          intent: safety.intent,
          toolCalls: ['transferToHuman'],
        };
      }

      state.messages.push({ role: 'user', content: request.message });
      const messages: LlmMessage[] = [
        { role: 'system', content: await getSystemPrompt() },
        ...state.messages,
      ];
      const calledTools: string[] = [];

      for (let round = 0; round < maxToolRounds; round += 1) {
        const response = await options.llm.functionCalling(messages, toolDefinitions);

        if (response.toolCalls.length === 0) {
          const message = response.content
            ? toPlainText(response.content)
            : '抱歉，我暂时无法回答这个问题。';
          state.messages.push({ role: 'assistant', content: message });
          trimHistory(state);
          return {
            conversationId,
            message,
            intent: inferIntent(calledTools),
            toolCalls: calledTools,
          };
        }

        messages.push({
          role: 'assistant',
          content: response.content,
          toolCalls: response.toolCalls,
        });

        for (const call of response.toolCalls) {
          calledTools.push(call.name);
          let result: unknown;
          try {
            result = await executeTool(call.name, JSON.parse(call.arguments));
          } catch (error) {
            result = {
              success: false,
              error: error instanceof Error ? error.message : '工具调用失败',
            };
          }

          if (isFailedToolResult(result)) state.failedToolResults += 1;
          else state.failedToolResults = 0;

          messages.push({
            role: 'tool',
            content: JSON.stringify(result),
            toolCallId: call.id,
          });
        }

        if (state.failedToolResults >= 2) {
          const handoff = await transferToHuman({});
          const message = formatHandoff(handoff);
          state.messages.push({ role: 'assistant', content: message });
          return {
            conversationId,
            message,
            intent: 'repeat_failure',
            toolCalls: [...calledTools, 'transferToHuman'],
          };
        }
      }

      const handoff = await transferToHuman({});
      const message = formatHandoff(handoff);
      state.messages.push({ role: 'assistant', content: message });
      return {
        conversationId,
        message,
        intent: 'repeat_failure',
        toolCalls: [...calledTools, 'transferToHuman'],
      };
    },
  };
}

function remember(state: ConversationState, userMessage: string, assistantMessage: string) {
  state.messages.push(
    { role: 'user', content: userMessage },
    { role: 'assistant', content: assistantMessage },
  );
  trimHistory(state);
}

function trimHistory(state: ConversationState) {
  if (state.messages.length > 20) state.messages.splice(0, state.messages.length - 20);
}

function isFailedToolResult(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    value.success === false
  );
}

function formatHandoff(result: Awaited<ReturnType<typeof transferToHuman>>): string {
  if (!result.success || !result.contact) {
    return '抱歉，这个问题需要人工客服进一步处理，请稍后再试。';
  }
  return `抱歉，这个问题需要人工客服进一步处理。人工客服：${result.contact}（服务时间 ${result.serviceHours ?? '请以客服实际在线时间为准'}）。`;
}

const toolIntents: Partial<Record<ToolName, string>> = {
  getProduct: 'query_product',
  recommendProduct: 'recommend_product',
  getOrder: 'query_order',
  getLogistics: 'query_logistics',
  getCoupon: 'query_coupon',
  getFaq: 'query_faq',
  getRefundPolicy: 'refund',
  transferToHuman: 'human_service',
};

function inferIntent(toolCalls: string[]): string | undefined {
  const latest = toolCalls.at(-1) as ToolName | undefined;
  return latest ? toolIntents[latest] : undefined;
}

function toPlainText(content: string): string {
  return content
    .trim()
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '');
}
