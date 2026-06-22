export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-3" role="status" aria-label="客服正在输入">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </div>
  );
}
