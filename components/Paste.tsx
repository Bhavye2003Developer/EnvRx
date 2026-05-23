'use client'

interface PasteProps {
  value: string
  onChange: (value: string) => void
}

export default function Paste({ value, onChange }: PasteProps) {
  return (
    <div className="w-full">
      <label htmlFor="env-paste" className="block text-sm font-medium text-zinc-400 mb-2">
        Paste your <code className="font-mono text-zinc-300">.env</code> file contents
      </label>
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
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-y"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="mt-2 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
