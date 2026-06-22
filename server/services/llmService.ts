import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

import { createDeepSeekClient } from '../config/deepseek.js';
import type { ToolDefinition } from '../agent/toolRegistry.js';

export interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
}

export interface LlmToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  toolCallId?: string;
  toolCalls?: LlmToolCall[];
}

export interface LlmResponse {
  content: string | null;
  toolCalls: LlmToolCall[];
}

export interface LlmRequest {
  model: string;
  messages: LlmMessage[];
  thinking: { type: 'disabled' };
  tools?: ToolDefinition[];
  toolChoice?: 'auto';
}

export interface LlmTransport {
  complete(request: LlmRequest): Promise<LlmResponse>;
  stream(request: LlmRequest): AsyncIterable<string>;
}

export interface LlmService {
  chat(messages: LlmMessage[]): Promise<LlmResponse>;
  functionCalling(
    messages: LlmMessage[],
    tools: ToolDefinition[],
  ): Promise<LlmResponse>;
  stream(messages: LlmMessage[]): AsyncIterable<string>;
}

export function createLlmService(
  config: LlmConfig,
  transport: LlmTransport = createOpenAiTransport(config),
): LlmService {
  const baseRequest = (messages: LlmMessage[]): LlmRequest => ({
    model: config.model,
    messages,
    thinking: { type: 'disabled' },
  });

  return {
    chat(messages) {
      return transport.complete(baseRequest(messages));
    },
    functionCalling(messages, tools) {
      return transport.complete({
        ...baseRequest(messages),
        tools,
        toolChoice: 'auto',
      });
    },
    stream(messages) {
      return transport.stream(baseRequest(messages));
    },
  };
}

function createOpenAiTransport(config: LlmConfig): LlmTransport {
  const client = createDeepSeekClient(config);

  return {
    async complete(request) {
      const body: ChatCompletionCreateParamsNonStreaming & {
        thinking: { type: 'disabled' };
      } = {
        model: request.model,
        messages: toOpenAiMessages(request.messages),
        tools: request.tools as ChatCompletionTool[] | undefined,
        tool_choice: request.toolChoice,
        stream: false,
        thinking: request.thinking,
      };
      const completion = await client.chat.completions.create(body);
      const message = completion.choices[0]?.message;
      if (!message) throw new Error('DeepSeek 返回了空响应');

      return {
        content: message.content,
        toolCalls: (message.tool_calls ?? [])
          .filter((call) => call.type === 'function')
          .map((call) => ({
            id: call.id,
            name: call.function.name,
            arguments: call.function.arguments,
          })),
      };
    },
    async *stream(request) {
      const body: ChatCompletionCreateParamsStreaming & {
        thinking: { type: 'disabled' };
      } = {
        model: request.model,
        messages: toOpenAiMessages(request.messages),
        stream: true,
        thinking: request.thinking,
      };
      const stream = await client.chat.completions.create(body);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta.content;
        if (content) yield content;
      }
    },
  };
}

function toOpenAiMessages(messages: LlmMessage[]): ChatCompletionMessageParam[] {
  return messages.map((message): ChatCompletionMessageParam => {
    if (message.role === 'tool') {
      if (!message.toolCallId) throw new Error('Tool 消息缺少 toolCallId');
      return {
        role: 'tool',
        content: message.content ?? '',
        tool_call_id: message.toolCallId,
      };
    }

    if (message.role === 'assistant') {
      return {
        role: 'assistant',
        content: message.content,
        tool_calls: message.toolCalls?.map((call) => ({
          id: call.id,
          type: 'function',
          function: { name: call.name, arguments: call.arguments },
        })),
      };
    }

    return { role: message.role, content: message.content ?? '' };
  });
}
