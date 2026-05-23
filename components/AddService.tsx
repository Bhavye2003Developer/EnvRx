'use client'

import { useState } from 'react'
import type { CustomService } from '@/lib/customServices'
import { newCustomService, encodeShareUrl } from '@/lib/customServices'
import type { Risk } from '@/data/services'

interface Props {
  services: CustomService[]
  onChange: (services: CustomService[]) => void
}

const RISK_OPTIONS: { value: Risk; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'text-red-400' },
  { value: 'medium', label: 'Medium', color: 'text-orange-400' },
  { value: 'low', label: 'Low', color: 'text-zinc-400' },
]

function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service: CustomService
  onSave: (s: CustomService) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(service)

  const valid = draft.name.trim() && draft.keyPattern.trim()

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900 p-4 space-y-3">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">New service</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-zinc-500 mb-1">Service name</label>
          <input
            type="text"
            value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            placeholder="My Service"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-500 mb-1">Key name / pattern</label>
          <input
            type="text"
            value={draft.keyPattern}
            onChange={e => setDraft(d => ({ ...d, keyPattern: e.target.value }))}
            placeholder="MY_SERVICE_API_KEY"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-zinc-500 mb-1">Rotation URL <span className="text-zinc-700">(optional)</span></label>
          <input
            type="url"
            value={draft.rotationUrl}
            onChange={e => setDraft(d => ({ ...d, rotationUrl: e.target.value }))}
            placeholder="https://service.com/api-keys"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-500 mb-1">Risk level</label>
          <div className="flex gap-2 mt-1.5">
            {RISK_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDraft(d => ({ ...d, risk: opt.value }))}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium border transition-colors ${
                  draft.risk === opt.value
                    ? 'border-zinc-600 bg-zinc-800 ' + opt.color
                    : 'border-zinc-800 bg-zinc-950 text-zinc-600 hover:border-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-zinc-500 mb-1">Note <span className="text-zinc-700">(optional)</span></label>
        <input
          type="text"
          value={draft.note}
          onChange={e => setDraft(d => ({ ...d, note: e.target.value }))}
          placeholder="Short warning shown on the card"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => valid && onSave(draft)}
          disabled={!valid}
          className="rounded-lg bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
        >
          Add service
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-zinc-800 px-4 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AddService({ services, onChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleSave(s: CustomService) {
    const updated = [...services, s]
    onChange(updated)
    setAdding(false)
  }

  function handleRemove(id: string) {
    onChange(services.filter(s => s.id !== id))
  }

  function handleShare() {
    if (services.length === 0) return
    const url = encodeShareUrl(services)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <section className="mt-7 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-400">Custom Services</h2>
        <div className="flex items-center gap-2">
          {services.length > 0 && (
            <button
              onClick={handleShare}
              className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {copied ? '✓ Link copied' : 'Share →'}
            </button>
          )}
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
            >
              + Add service
            </button>
          )}
        </div>
      </div>

      {services.length === 0 && !adding && (
        <p className="text-[12px] text-zinc-700">
          Add a private service and get rotation reminders when its key appears. Share the link with your team.
        </p>
      )}

      {services.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {services.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] font-bold uppercase ${
                  s.risk === 'high' ? 'text-red-500' : s.risk === 'medium' ? 'text-orange-500' : 'text-zinc-500'
                }`}>{s.risk}</span>
                <span className="text-sm text-zinc-300">{s.name}</span>
                <span className="font-mono text-[11px] text-zinc-600 truncate">{s.keyPattern}</span>
              </div>
              <button
                onClick={() => handleRemove(s.id)}
                className="ml-2 shrink-0 text-[11px] text-zinc-700 hover:text-red-400 transition-colors"
              >
                remove
              </button>
            </div>
          ))}
        </div>
      )}

      {adding && (
        <ServiceForm
          service={newCustomService()}
          onSave={handleSave}
          onCancel={() => setAdding(false)}
        />
      )}
    </section>
  )
}
