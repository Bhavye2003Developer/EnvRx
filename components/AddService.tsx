'use client'

import { useState, useEffect } from 'react'
import type { Risk } from '@/data/services'

export interface CommunityService {
  id: string
  name: string
  key_pattern: string
  rotation_url: string
  risk: Risk
  note: string
}

interface Props {
  onServicesChange: (services: CommunityService[]) => void
}

const RISK_OPTIONS: { value: Risk; label: string; activeClass: string }[] = [
  { value: 'high',   label: 'High',   activeClass: 'border-red-500/50 bg-red-500/10 text-red-400' },
  { value: 'medium', label: 'Medium', activeClass: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
  { value: 'low',    label: 'Low',    activeClass: 'border-zinc-600 bg-zinc-800 text-zinc-300' },
]

function ServiceForm({
  onSave,
  onCancel,
}: {
  onSave: (s: Omit<CommunityService, 'id'>) => Promise<void>
  onCancel: () => void
}) {
  const [draft, setDraft] = useState({
    name: '',
    key_pattern: '',
    rotation_url: '',
    risk: 'medium' as Risk,
    note: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const valid = draft.name.trim() && draft.key_pattern.trim()

  async function handleSave() {
    if (!valid) return
    setSaving(true)
    setError('')
    try {
      await onSave(draft)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-4">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">New service</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">Service name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            placeholder="My Service"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">Key pattern <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={draft.key_pattern}
            onChange={e => setDraft(d => ({ ...d, key_pattern: e.target.value }))}
            placeholder="MY_SERVICE_API_KEY"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">Rotation URL <span className="text-zinc-700">(optional)</span></label>
          <input
            type="url"
            value={draft.rotation_url}
            onChange={e => setDraft(d => ({ ...d, rotation_url: e.target.value }))}
            placeholder="https://service.com/api-keys"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">Risk level</label>
          <div className="flex gap-1.5">
            {RISK_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDraft(d => ({ ...d, risk: opt.value }))}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${
                  draft.risk === opt.value
                    ? opt.activeClass
                    : 'border-zinc-800 bg-zinc-950 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">Note <span className="text-zinc-700">(optional)</span></label>
        <input
          type="text"
          value={draft.note}
          onChange={e => setDraft(d => ({ ...d, note: e.target.value }))}
          placeholder="Short warning shown on the result card"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none transition-colors"
        />
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">{error}</p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          disabled={!valid || saving}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          {saving ? 'Saving...' : 'Add service'}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const RISK_DOT: Record<Risk, string> = {
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-zinc-500',
}

export default function AddService({ onServicesChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [services, setServices] = useState<CommunityService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/community-services')
      .then(r => r.json())
      .then((data: CommunityService[]) => {
        setServices(data)
        onServicesChange(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave(draft: Omit<CommunityService, 'id'>) {
    const id = crypto.randomUUID()
    const res = await fetch('/api/community-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, id }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? 'Failed to save')
    }

    const updated = [{ ...draft, id }, ...services]
    setServices(updated)
    onServicesChange(updated)
    setAdding(false)
  }

  return (
    <section className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30 px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">Community Services</h2>
          <p className="mt-0.5 text-[11px] text-zinc-600">
            {loading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''} shared by the community`}
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="rounded-lg border border-zinc-700/60 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            + Add service
          </button>
        )}
      </div>

      {!loading && services.length === 0 && !adding && (
        <p className="mt-3 text-[12px] text-zinc-700">
          No community services yet. Add one and it will be visible to all users - no account required.
        </p>
      )}

      {services.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {services.map(s => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-2.5"
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${RISK_DOT[s.risk]}`} />
              <span className="text-sm font-medium text-zinc-300 shrink-0">{s.name}</span>
              <span className="font-mono text-[11px] text-zinc-600 truncate">{s.key_pattern}</span>
              {s.rotation_url && (
                <a
                  href={s.rotation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto shrink-0 text-[11px] text-zinc-700 transition-colors hover:text-zinc-400"
                >
                  ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {adding && (
        <ServiceForm
          onSave={handleSave}
          onCancel={() => setAdding(false)}
        />
      )}
    </section>
  )
}
