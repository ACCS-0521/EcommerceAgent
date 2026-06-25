import { randomUUID } from 'node:crypto';

import { evaluateSafetyPolicy } from '../agent/safetyPolicy.js';
import { getSystemPrompt } from '../agent/systemPrompt.js';
import {
  executeTool,
  toolDefinitions,
  type ToolName,
} from '../agent/toolRegistry.js';
import type { LlmMessage, LlmService } from './llmService.js';
import type { McpToolExecutor } from '../mcp/mcpToolExecutor.js';

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

interface ResponseContext {
  intent: string;
  message: LlmMessage;
  toolCalls: string[];
}

export function createChatService(options: {
  llm: LlmService;
  toolExecutor?: McpToolExecutor;
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
        const handoff = await callTransferToHuman(options.toolExecutor);
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
      const responseContext = await getResponseContext(
        request.message,
        options.toolExecutor,
      );
      const messages: LlmMessage[] = [
        { role: 'system', content: await getSystemPrompt() },
        ...(responseContext ? [responseContext.message] : []),
        ...state.messages,
      ];
      const calledTools: string[] = responseContext?.toolCalls ?? [];

      for (let round = 0; round < maxToolRounds; round += 1) {
        const tools = options.toolExecutor
          ? await options.toolExecutor.listTools()
          : toolDefinitions;
        const response = await options.llm.functionCalling(messages, tools);

        if (response.toolCalls.length === 0) {
          const message = response.content
            ? toPlainText(response.content)
            : '抱歉，我暂时无法回答这个问题。';
          state.messages.push({ role: 'assistant', content: message });
          trimHistory(state);
          return {
            conversationId,
            message,
            intent: inferIntent(calledTools) ?? responseContext?.intent,
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
            const args = JSON.parse(call.arguments);
            result =
              call.name === 'transferToHuman'
                ? {
                    success: true,
                    message:
                      '当前问题不需要转人工。请直接回答用户问题，或调用 getProduct、recommendProduct、getFaq、getOrder、getLogistics、getCoupon、getRefundPolicy 中更合适的工具。',
                  }
                : await callTool(options.toolExecutor, call.name, args);
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
          const handoff = await callTransferToHuman(options.toolExecutor);
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

      const handoff = await callTransferToHuman(options.toolExecutor);
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

async function getResponseContext(
  message: string,
  toolExecutor: McpToolExecutor | undefined,
): Promise<ResponseContext | null> {
  const normalized = message.trim();

  if (/你是.*(?:机器人|人工客服|真人)|(?:机器人|人工客服|真人).*(?:吗|还是)/i.test(normalized)) {
    return {
      intent: 'assistant_identity',
      message: {
        role: 'system',
        content:
          '意图：assistant_identity。当前用户在询问客服身份。事实：你是智能电商客服助手，不是真人客服，也不是人工客服；你可以处理商品咨询、商品推荐、订单查询、物流查询、优惠券查询和售后规则咨询；只有投诉、赔偿、金额争议、法律问题、账号异常、情绪激动或用户明确要求人工时才转人工。请根据用户问法自然回答，不要逐字复述事实，不要调用 transferToHuman。',
      },
      toolCalls: [],
    };
  }

  if (/人工客服.*(?:什么时候|几点|上班|服务时间)|(?:什么时候|几点).*(?:人工客服|客服).*上班/i.test(normalized)) {
    const handoff = await callTransferToHuman(toolExecutor);
    const serviceHours =
      isHandoffResult(handoff) && handoff.success
        ? {
            contact: handoff.contact ?? 'service001',
            serviceHours: handoff.serviceHours ?? '09:00-21:00',
          }
        : { contact: 'service001', serviceHours: '09:00-21:00' };

    return {
      intent: 'assistant_identity',
      message: {
        role: 'system',
        content: `意图：human_service_info。当前用户在询问人工客服服务时间。事实：人工客服编号是 ${serviceHours.contact}，服务时间是 ${serviceHours.serviceHours}。请直接回答服务时间，可以顺带说明普通商品、订单、物流、优惠券问题你也可以先处理。不要说“需要人工进一步处理”，不要调用 transferToHuman。`,
      },
      toolCalls: [],
    };
  }

  if (/卖什么|有什么产品|主营.*产品|经营.*产品/.test(normalized)) {
    const result = await callTool(toolExecutor, 'recommendProduct', {});
    if (isRecommendResult(result) && result.success && result.products.length > 0) {
      const categories = [...new Set(result.products.map((product) => product.category))];
      return {
        intent: 'recommend_product',
        message: {
          role: 'system',
          content: `意图：store_scope。当前用户在询问店铺经营范围。事实：店铺主要销售这些品类：${categories.join('、')}。可参考商品：${result.products
            .map((product) => product.name)
            .join('、')}。请自然概括，不要长篇列完整参数；可以邀请用户补充预算或用途以便推荐。不要调用 transferToHuman。`,
        },
        toolCalls: ['recommendProduct'],
      };
    }
  }

  return null;
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

async function callTool(
  toolExecutor: McpToolExecutor | undefined,
  name: string,
  args: unknown,
): Promise<unknown> {
  return toolExecutor ? toolExecutor.execute(name, args) : executeTool(name, args);
}

async function callTransferToHuman(
  toolExecutor: McpToolExecutor | undefined,
): Promise<unknown> {
  return callTool(toolExecutor, 'transferToHuman', {});
}

function formatHandoff(result: unknown): string {
  if (!isHandoffResult(result)) {
    return '抱歉，这个问题需要人工客服进一步处理，请稍后再试。';
  }

  if (!result.success || !result.contact) {
    return '抱歉，这个问题需要人工客服进一步处理，请稍后再试。';
  }
  return `抱歉，这个问题需要人工客服进一步处理。人工客服：${result.contact}（服务时间 ${result.serviceHours ?? '请以客服实际在线时间为准'}）。`;
}

function isHandoffResult(value: unknown): value is {
  success: boolean;
  contact?: string;
  serviceHours?: string;
} {
  return typeof value === 'object' && value !== null && 'success' in value;
}

function isRecommendResult(value: unknown): value is {
  success: boolean;
  products: Array<{ name: string; category: string }>;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    'products' in value &&
    Array.isArray(value.products)
  );
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
