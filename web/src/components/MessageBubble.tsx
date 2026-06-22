import type { Message } from '../types';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[85%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-3 text-sm leading-6 text-white sm:max-w-[75%]'
            : 'max-w-[90%] px-1 py-2 text-sm leading-7 text-zinc-800 sm:max-w-[82%]'
        }
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
