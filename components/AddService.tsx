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

const LS_KEY = 'envrx-community-services'

const RISK_OPTIONS: { value: Risk; label: string; activeClass: string }[] = [
  { value: 'high',   label: 'High',   activeClass: 'border-red-500/50 bg-red-500/10 text-red-400' },
  { value: 'medium', label: 'Medium', activeClass: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
  { value: 'low',    label: 'Low',    activeClass: 'border-zinc-600 bg-zinc-800 text-zinc-300' },
]

const RISK_DOT: Record<Risk, string> = {
  high:   'bg-red-500',
  medium: 'bg-orange-500',
  low:    'bg-zinc-500',
}

const RISK_PILL: Record<Risk, string> = {
  high:   'text-red-400 bg-red-500/10 ring-red-500/20',
  medium: 'text-orange-400 bg-orange-500/10 ring-orange-500/20',
  low:    'text-zinc-400 bg-zinc-700/40 ring-zinc-700/50',
}

type FilterRisk = Risk | 'all'

function ServiceForm({
  onSave,
  onCancel,
}: {
  onSave: (s: Omit<CommunityService, 'id'>) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState({
    name: '',
    key_pattern: '',
    rotation_url: '',
    risk: 'medium' as Risk,
    note: '',
  })

  const valid = draft.name.trim() && draft.key_pattern.trim()

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

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => valid && onSave(draft)}
          disabled={!valid}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Add service
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

export default function AddService({ onServicesChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [services, setServices] = useState<CommunityService[]>([])
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('all')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      const data: CommunityService[] = stored ? JSON.parse(stored) : []
      setServices(data)
      onServicesChange(data)
    } catch {
      setServices([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function save(updated: CommunityService[]) {
    setServices(updated)
    onServicesChange(updated)
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch {}
  }

  function handleSave(draft: Omit<CommunityService, 'id'>) {
    const entry: CommunityService = { ...draft, id: crypto.randomUUID() }
    save([entry, ...services])
    setAdding(false)
  }

  function handleDelete(id: string) {
    save(services.filter(s => s.id !== id))
  }

  const filtered = services.filter(s => {
    const matchesRisk = filterRisk === 'all' || s.risk === filterRisk
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.key_pattern.toLowerCase().includes(q)
    return matchesRisk && matchesSearch
  })

  return (
    <section className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30 px-5 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">My Services</h2>
          <p className="mt-0.5 text-[11px] text-zinc-600">
            {services.length} service{services.length !== 1 ? 's' : ''} saved locally
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="shrink-0 rounded-lg border border-zinc-700/60 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            + Add service
          </button>
        )}
      </div>

      {/* Search + filter */}
      {services.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[140px]">
            <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-1.5 pl-7 pr-3 text-[11px] text-zinc-300 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value as FilterRisk)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-400 focus:border-zinc-600 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All risks</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      )}

      {/* Empty states */}
      {services.length === 0 && !adding && (
        <p className="mt-3 text-[12px] text-zinc-700">
          No custom services yet. Add one to detect keys from your own tools and services.
        </p>
      )}
      {services.length > 0 && filtered.length === 0 && (
        <p className="mt-3 text-[12px] text-zinc-600">No services match your filters.</p>
      )}

      {/* Scrollable list */}
      {filtered.length > 0 && (
        <div className="mt-3 max-h-[220px] space-y-1.5 overflow-y-auto pr-0.5">
          {filtered.map(s => (
            <div key={s.id} className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-2.5 group">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${RISK_DOT[s.risk]}`} />
              <span className="shrink-0 text-sm font-medium text-zinc-300">{s.name}</span>
              <code className="min-w-0 truncate font-mono text-[11px] text-zinc-600">{s.key_pattern}</code>
              <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${RISK_PILL[s.risk]}`}>
                {s.risk}
              </span>
              {s.rotation_url && (
                <a href={s.rotation_url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[11px] text-zinc-700 transition-colors hover:text-zinc-400">
                  ↗
                </a>
              )}
              <button
                onClick={() => handleDelete(s.id)}
                className="shrink-0 rounded p-0.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-400"
                title="Delete"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {adding && (
        <ServiceForm onSave={handleSave} onCancel={() => setAdding(false)} />
      )}
    </section>
  )
}
