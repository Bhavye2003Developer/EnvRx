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
type Tab = 'local' | 'global'

function ServiceForm({
  onSave,
  onCancel,
  saving,
}: {
  onSave: (s: Omit<CommunityService, 'id'>) => Promise<void>
  onCancel: () => void
  saving?: boolean
}) {
  const [draft, setDraft] = useState({
    name: '',
    key_pattern: '',
    rotation_url: '',
    risk: 'medium' as Risk,
    note: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const valid = draft.name.trim() && draft.key_pattern.trim()

  async function handleSave() {
    if (!valid) return
    setBusy(true)
    setError('')
    try {
      await onSave(draft)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
      setBusy(false)
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
          disabled={!valid || busy}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          {busy ? 'Saving...' : 'Add service'}
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

function ServiceList({
  services,
  onDelete,
  emptyText,
}: {
  services: CommunityService[]
  onDelete?: (id: string) => void
  emptyText: string
}) {
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('all')

  const filtered = services.filter(s => {
    const matchesRisk = filterRisk === 'all' || s.risk === filterRisk
    const q = search.trim().toLowerCase()
    return matchesRisk && (!q || s.name.toLowerCase().includes(q) || s.key_pattern.toLowerCase().includes(q))
  })

  if (services.length === 0) {
    return <p className="mt-3 text-[12px] text-zinc-700">{emptyText}</p>
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
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

      {filtered.length === 0 ? (
        <p className="mt-3 text-[12px] text-zinc-600">No services match your filters.</p>
      ) : (
        <div className="mt-3 max-h-[220px] space-y-1.5 overflow-y-auto pr-0.5">
          {filtered.map(s => (
            <div key={s.id} className="group flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-2.5">
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
              {onDelete && (
                <button
                  onClick={() => onDelete(s.id)}
                  className="shrink-0 rounded p-0.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-400"
                  title="Delete"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function AddService({ onServicesChange }: Props) {
  const [tab, setTab] = useState<Tab>('local')
  const [adding, setAdding] = useState(false)

  const [localServices, setLocalServices] = useState<CommunityService[]>([])
  const [globalServices, setGlobalServices] = useState<CommunityService[]>([])
  const [globalLoading, setGlobalLoading] = useState(true)

  // Load local from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      const data: CommunityService[] = stored ? JSON.parse(stored) : []
      setLocalServices(data)
    } catch {
      setLocalServices([])
    }
  }, [])

  // Load global from API
  useEffect(() => {
    fetch('/api/community-services')
      .then(r => r.json())
      .then((data: CommunityService[]) => setGlobalServices(data))
      .catch(() => {})
      .finally(() => setGlobalLoading(false))
  }, [])

  // Notify parent whenever either list changes
  useEffect(() => {
    const seen = new Set<string>()
    const merged = [...localServices, ...globalServices].filter(s => {
      if (seen.has(s.key_pattern)) return false
      seen.add(s.key_pattern)
      return true
    })
    onServicesChange(merged)
  }, [localServices, globalServices]) // eslint-disable-line react-hooks/exhaustive-deps

  function saveLocal(updated: CommunityService[]) {
    setLocalServices(updated)
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch {}
  }

  function handleLocalSave(draft: Omit<CommunityService, 'id'>) {
    return Promise.resolve().then(() => {
      saveLocal([{ ...draft, id: crypto.randomUUID() }, ...localServices])
      setAdding(false)
    })
  }

  async function handleGlobalSave(draft: Omit<CommunityService, 'id'>) {
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
    setGlobalServices(prev => [{ ...draft, id }, ...prev])
    setAdding(false)
  }

  function handleLocalDelete(id: string) {
    saveLocal(localServices.filter(s => s.id !== id))
  }

  const tabs: { key: Tab; label: string; count: number; desc: string }[] = [
    { key: 'local',  label: 'Local',  count: localServices.length,  desc: 'Saved in your browser only' },
    { key: 'global', label: 'Global', count: globalServices.length, desc: 'Shared with all users' },
  ]

  return (
    <section className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30 px-5 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-200">Community Services</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="shrink-0 rounded-lg border border-zinc-700/60 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            + Add service
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-3 flex gap-0 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setAdding(false) }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-[11px] font-medium transition-colors ${
              tab === t.key
                ? 'bg-zinc-800 text-zinc-200'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {t.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
              tab === t.key ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-900 text-zinc-600'
            }`}>
              {t.key === 'global' && globalLoading ? '...' : t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab description */}
      <p className="mt-2 text-[11px] text-zinc-600">
        {tab === 'local'
          ? 'Only visible to you. Add and delete freely.'
          : 'Visible to all users. Anyone can add, but entries cannot be deleted.'}
      </p>

      {/* Content */}
      {tab === 'local' && (
        <ServiceList
          services={localServices}
          onDelete={handleLocalDelete}
          emptyText="No local services yet. Add one to detect keys from your own tools."
        />
      )}

      {tab === 'global' && (
        globalLoading ? (
          <p className="mt-3 text-[12px] text-zinc-700">Loading...</p>
        ) : (
          <ServiceList
            services={globalServices}
            emptyText="No global services yet. Be the first to add one."
          />
        )
      )}

      {/* Add form */}
      {adding && (
        <ServiceForm
          onSave={tab === 'local' ? handleLocalSave : handleGlobalSave}
          onCancel={() => setAdding(false)}
        />
      )}
    </section>
  )
}
