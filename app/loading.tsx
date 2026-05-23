export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-zinc-100">Env</span>
        <span
          className="text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rx
        </span>
      </div>
      <div className="mt-6 flex gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-700 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-700 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-700 [animation-delay:300ms]" />
      </div>
    </div>
  )
}
