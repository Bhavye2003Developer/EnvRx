'use client'

import { useState, useRef, useEffect } from 'react'
import { SERVICES } from '@/data/services'
import type { CommunityService } from './AddService'

interface Props {
  communityServices: CommunityService[]
  selected: Set<string> | null   // null = all
  onChange: (selected: Set<string> | null) => void
}

export default function ServiceFilter({ communityServices, selected, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const builtInNames = SERVICES.map(s => s.name)
  const communityNames = communityServices.map(s => s.name).filter(n => !builtInNames.includes(n))
  const allNames = [...builtInNames, ...communityNames]

  const isAll = selected === null
  const count = isAll ? 0 : selected.size

  const visible = allNames.filter(n =>
    !search.trim() || n.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(name: string) {
    if (isAll) {
      // Start from "all selected" -> uncheck just this one means select all others
      const next = new Set(allNames.filter(n => n !== name))
      onChange(next.size === allNames.length ? null : next)
    } else {
      const next = new Set(selected)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      onChange(next.size === allNames.length || next.size === 0 ? null : next)
    }
  }

  function isChecked(name: string) {
    return isAll || selected.has(name)
  }

  function selectAll() {
    onChange(null)
    setSearch('')
  }

  function clearAll() {
    onChange(new Set())
    setSearch('')
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
          isAll
            ? 'border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            : 'border-zinc-600 bg-zinc-800 text-zinc-200'
        }`}
      >
        <svg className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
        </svg>
        {isAll ? 'All services' : `${count} selected`}
        <svg className={`h-2.5 w-2.5 text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/40">
          {/* Search */}
          <div className="border-b border-zinc-800/60 p-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              autoFocus
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          {/* Select all / Clear */}
          <div className="flex gap-0 border-b border-zinc-800/60">
            <button
              onClick={selectAll}
              className={`flex-1 py-1.5 text-[10px] font-medium transition-colors ${isAll ? 'text-zinc-500' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Select all
            </button>
            <div className="w-px bg-zinc-800/60" />
            <button
              onClick={clearAll}
              className="flex-1 py-1.5 text-[10px] font-medium text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Clear
            </button>
          </div>

          {/* List */}
          <div className="max-h-[220px] overflow-y-auto py-1">
            {visible.length === 0 && (
              <p className="px-3 py-2 text-[11px] text-zinc-600">No matches</p>
            )}
            {visible.map(name => {
              const checked = isChecked(name)
              const isCommunity = communityNames.includes(name)
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-zinc-900"
                >
                  <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                    checked
                      ? 'border-zinc-500 bg-zinc-600'
                      : 'border-zinc-700 bg-transparent'
                  }`}>
                    {checked && (
                      <svg className="h-2 w-2 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[12px] ${checked ? 'text-zinc-200' : 'text-zinc-500'}`}>{name}</span>
                  {isCommunity && (
                    <span className="ml-auto text-[9px] font-medium text-zinc-700">custom</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
