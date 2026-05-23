'use client'

interface PasteProps {
  value: string
  onChange: (value: string) => void
  onExample: () => void
}

export default function Paste({ value, onChange, onExample }: PasteProps) {
  const keyCount = value
    ? value.split('\n').filter(l => l.trim() && !l.trim().startsWith('#') && l.includes('=')).length
    : 0
  const lineCount = value ? value.split('\n').length : 0

  return (
    <div className="w-full">
      <div className="mb-2.5 flex h-8 items-center justify-between">
        <label htmlFor="env-paste" className="text-sm font-medium text-zinc-300">
          Paste your{' '}
          <code className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-zinc-200 sm:text-[12px]">.env</code>{' '}
          contents
        </label>
        <div className="flex items-center gap-3">
          {value ? (
            <>
              <span className="text-[11px] text-zinc-600">{keyCount} var{keyCount !== 1 ? 's' : ''}</span>
              <button
                onClick={() => onChange('')}
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Clear
              </button>
            </>
          ) : (
            <button
              onClick={onExample}
              className="flex items-center gap-1.5 rounded-md border border-zinc-700/60 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
            >
              Try example
              <span className="text-zinc-600">↗</span>
            </button>
          )}
        </div>
      </div>

      <div className="group relative">
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"
          style={{ boxShadow: '0 0 0 1px rgba(248,113,113,0.25), 0 0 24px rgba(248,113,113,0.06)' }}
        />
        <textarea
          id="env-paste"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={'OPENAI_API_KEY=sk-...\nSTRIPE_SECRET_KEY=sk_live_...\nDATABASE_URL=postgres://...'}
          rows={10}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="relative w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-3 font-mono text-[11px] leading-relaxed text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-700 focus:outline-none transition-colors sm:px-4 sm:py-3.5 sm:text-[13px]"
        />
        {value && (
          <div className="absolute bottom-2.5 right-3 text-[10px] text-zinc-700 pointer-events-none">
            {lineCount} lines
          </div>
        )}
      </div>
    </div>
  )
}
