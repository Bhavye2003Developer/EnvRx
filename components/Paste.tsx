'use client'

interface PasteProps {
  value: string
  onChange: (value: string) => void
  onExample: () => void
}

export default function Paste({ value, onChange, onExample }: PasteProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="env-paste" className="text-sm font-medium text-zinc-400">
          Paste your <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[13px] text-zinc-300">.env</code> contents
        </label>
        <div className="flex items-center gap-3">
          {value ? (
            <button
              onClick={() => onChange('')}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-400"
            >
              Clear
            </button>
          ) : (
            <button
              onClick={onExample}
              className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Try an example
              <span className="text-zinc-600">→</span>
            </button>
          )}
        </div>
      </div>

      <div className="group relative">
        {/* Focus glow ring */}
        <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"
          style={{ background: 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(251,146,60,0.10))', borderRadius: '12px' }}
        />
        <textarea
          id="env-paste"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`OPENAI_API_KEY=sk-...\nSTRIPE_SECRET_KEY=sk_live_...\nDATABASE_URL=postgres://...`}
          rows={10}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="relative w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-700 focus:outline-none transition-colors"
        />
      </div>
    </div>
  )
}
