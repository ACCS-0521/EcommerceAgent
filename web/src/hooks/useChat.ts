import { useState } from 'react';

import { sendChat } from '../api/chat';
import type { Message } from '../types';

let nextMessageId = 1;

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: '您好，我是智能电商客服。请问有什么可以帮您？',
  },
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function send(message: string) {
    const content = message.trim();
    if (!content || isLoading) return;

    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: 'user', content },
    ]);
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await sendChat(content, conversationId);
      setConversationId(response.conversationId);
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: 'assistant', content: response.message },
      ]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : '消息发送失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, isLoading, error, send };
}

function createMessageId(): string {
  const id = `message-${nextMessageId}`;
  nextMessageId += 1;
  return id;
}
