export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <div className="flex items-center gap-1">
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        </div>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-secondary max-w-[200px]">
        <div className="flex items-center gap-2">
          <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
