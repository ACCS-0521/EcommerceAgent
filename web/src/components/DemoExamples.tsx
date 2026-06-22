import type { DemoExample } from '../api/demo';

export function DemoExamples({
  examples,
  disabled,
  onSelect,
}: {
  examples: DemoExample[];
  disabled: boolean;
  onSelect(message: string): Promise<void>;
}) {
  if (examples.length === 0) return null;

  return (
    <section className="mt-2" aria-labelledby="demo-examples-title">
      <p id="demo-examples-title" className="mb-3 text-xs font-medium text-zinc-500">
        演示快捷入口
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {examples.map((example) => (
          <button
            key={example.id}
            type="button"
            aria-label={example.label}
            disabled={disabled}
            onClick={() => void onSelect(example.message)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block text-sm font-medium text-zinc-800">{example.label}</span>
            <span className="mt-1 block text-xs text-zinc-500">{example.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
