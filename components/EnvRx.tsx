'use client'

import { useState, useMemo, useEffect } from 'react'
import Paste from './Paste'
import ResultCard from './ResultCard'
import GitCommands from './GitCommands'
import AddService from './AddService'
import { parseEnv } from '@/lib/parser'
import { matchServices } from '@/lib/matcher'
import {
  loadCustomServices,
  saveCustomServices,
  decodeShareHash,
  toServiceDef,
  type CustomService,
} from '@/lib/customServices'

const EXAMPLE_ENV = `# Example — paste your own .env below or try this sample
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr6
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=STRIPE_LIVE_KEY_REPLACE_ME
DATABASE_URL=postgres://myuser:s3cr3t@db.prod.example.com:5432/myapp
NEXTAUTH_SECRET=a8f5f167f44f4964e6c998dee827110c
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://myapp.com
PORT=3000`

function detectFilename(raw: string): string {
  const match = raw.match(/^#\s*filename[:\s]+(\S+)/im)
  return match ? match[1] : '.env'
}

export default function EnvRx() {
  const [raw, setRaw] = useState('')
  const [customServices, setCustomServices] = useState<CustomService[]>([])

  // Load from localStorage + URL hash on mount
  useEffect(() => {
    const fromHash = decodeShareHash(window.location.hash)
    const fromStorage = loadCustomServices()

    if (fromHash) {
      // Merge: deduplicate by id
      const ids = new Set(fromStorage.map(s => s.id))
      const merged = [...fromStorage, ...fromHash.filter(s => !ids.has(s.id))]
      setCustomServices(merged)
      saveCustomServices(merged)
      // Clean hash from URL without reload
      history.replaceState(null, '', window.location.pathname)
    } else {
      setCustomServices(fromStorage)
    }
  }, [])

  function handleCustomServicesChange(updated: CustomService[]) {
    setCustomServices(updated)
    saveCustomServices(updated)
  }

  const { matches, filename } = useMemo(() => {
    if (!raw.trim()) return { matches: [], filename: '.env' }
    const entries = parseEnv(raw)
    const customDefs = customServices.map(toServiceDef)
    const matches = matchServices(entries, customDefs)
    const filename = detectFilename(raw)
    return { matches, filename }
  }, [raw, customServices])

  const hasContent = raw.trim().length > 0

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% -10%, rgba(239,68,68,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 110%, rgba(168,85,247,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-14">
        {/* Header */}
        <header className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-900 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              100% client-side · nothing leaves your browser
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-zinc-100">Env</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #f87171 0%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Rx
            </span>
          </h1>
          <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-zinc-400">
            Paste a leaked <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[13px] text-zinc-300">.env</code> file.
            Get rotation links and git purge commands instantly.
          </p>
        </header>

        {/* Paste area */}
        <Paste value={raw} onChange={setRaw} onExample={() => setRaw(EXAMPLE_ENV)} />

        {/* Results */}
        {matches.length > 0 && (
          <section className="mt-7">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-300">
                {matches.length} secret{matches.length !== 1 ? 's' : ''} detected
              </span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>
            <div className="space-y-2.5">
              {matches.map((match, i) => (
                <ResultCard key={`${match.key}-${i}`} match={match} />
              ))}
            </div>
          </section>
        )}

        {hasContent && matches.length === 0 && (
          <p className="mt-6 text-sm text-zinc-500">No recognized secrets detected.</p>
        )}

        {/* Git commands — always shown */}
        <GitCommands filename={filename} />

        {/* Custom services */}
        <AddService services={customServices} onChange={handleCustomServicesChange} />

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-zinc-700">
          Client-side only · No data sent anywhere · No analytics · No storage
        </footer>
      </div>
    </div>
  )
}
