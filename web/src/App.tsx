import { ChatWindow } from './components/ChatWindow';
import { InputBox } from './components/InputBox';
import { useChat } from './hooks/useChat';
import { useDemoExamples } from './hooks/useDemoExamples';

export default function App() {
  const { messages, isLoading, error, send } = useChat();
  const demoExamples = useDemoExamples();

  return (
    <main className="flex h-dvh min-h-[36rem] flex-col bg-white text-zinc-900">
      <header className="border-b border-zinc-100 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
            E
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">EcommerceAgent</h1>
            <p className="text-xs text-zinc-500">智能电商客服</p>
          </div>
        </div>
      </header>

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        demoExamples={demoExamples}
        onSelectExample={send}
      />

      {error ? (
        <p className="mx-auto mb-3 w-full max-w-3xl px-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <InputBox disabled={isLoading} onSend={send} />
    </main>
  );
}
