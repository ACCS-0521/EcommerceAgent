import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

export function InputBox({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend(message: string): Promise<void>;
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const message = value.trim();
    if (!message || disabled) return;
    setValue('');
    await onSend(message);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  return (
    <form className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6 sm:pb-6" onSubmit={submit}>
      <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm focus-within:border-zinc-400">
        <textarea
          ref={textareaRef}
          className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-zinc-900 outline-none placeholder:text-zinc-400"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题…"
          aria-label="消息"
          rows={1}
          disabled={disabled}
        />
        <button
          className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          type="submit"
          disabled={disabled || !value.trim()}
        >
          发送
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-zinc-400">客服回复仅基于系统商品、订单与售后数据</p>
    </form>
  );
}
