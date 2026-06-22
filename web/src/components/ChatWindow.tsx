import { useEffect, useRef } from 'react';

import type { DemoExample } from '../api/demo';
import type { Message } from '../types';
import { DemoExamples } from './DemoExamples';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export function ChatWindow({
  messages,
  isLoading,
  demoExamples,
  onSelectExample,
}: {
  messages: Message[];
  isLoading: boolean;
  demoExamples: DemoExample[];
  onSelectExample(message: string): Promise<void>;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 sm:px-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {messages.length === 1 ? (
        <DemoExamples
          examples={demoExamples}
          disabled={isLoading}
          onSelect={onSelectExample}
        />
      ) : null}
      {isLoading ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}
