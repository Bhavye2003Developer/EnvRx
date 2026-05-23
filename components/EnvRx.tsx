'use client'

import { useState, useMemo } from 'react'
import Paste from './Paste'
import ResultCard from './ResultCard'
import GitCommands from './GitCommands'
import AddService from './AddService'
import type { CommunityService } from './AddService'
import { parseEnv } from '@/lib/parser'
import { matchServices } from '@/lib/matcher'
import type { ServiceDef } from '@/data/services'

const EXAMPLE_ENV = `# Example: paste your own .env below or try this sample
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

function communityToServiceDef(s: CommunityService): ServiceDef {
  return {
    name: s.name,
    patterns: [new RegExp(`^${s.key_pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')],
    rotationUrl: s.rotation_url,
    rotationLabel: s.rotation_url ? `Rotate in ${s.name}` : 'Find and revoke manually',
    risk: s.risk,
    note: s.note || undefined,
  }
}

const RISK_COUNTS = (matches: ReturnType<typeof matchServices>) => ({
  high: matches.filter(m => m.service.risk === 'high').length,
  medium: matches.filter(m => m.service.risk === 'medium').length,
  low: matches.filter(m => m.service.risk === 'low').length,
})

export default function EnvRx() {
  const [raw, setRaw] = useState('')
  const [communityServices, setCommunityServices] = useState<CommunityService[]>([])

  const { matches, filename } = useMemo(() => {
    if (!raw.trim()) return { matches: [], filename: '.env' }
    const entries = parseEnv(raw)
    const extraDefs = communityServices.map(communityToServiceDef)
    const matches = matchServices(entries, extraDefs)
    const filename = detectFilename(raw)
    return { matches, filename }
  }, [raw, communityServices])

  const hasContent = raw.trim().length > 0
  const counts = RISK_COUNTS(matches)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-10 pb-8 lg:pt-12 lg:pb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-900/80 px-3 py-1 text-[11px] font-medium text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                100% client-side: nothing leaves your browser
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="text-zinc-100">Env</span>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Rx
                </span>
              </h1>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-zinc-400">
                Paste a leaked{' '}
                <code className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[12px] text-zinc-200">.env</code>{' '}
                file and get rotation links with git purge commands instantly.
              </p>
            </div>

            {/* Stats pills - shown when results exist */}
            {matches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {counts.high > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-red-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    {counts.high} high
                  </span>
                )}
                {counts.medium > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    {counts.medium} medium
                  </span>
                )}
                {counts.low > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-700/40 px-3 py-1 text-xs font-semibold text-zinc-400 ring-1 ring-zinc-700/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    {counts.low} low
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          {/* Left: Paste */}
          <div>
            <Paste value={raw} onChange={setRaw} onExample={() => setRaw(EXAMPLE_ENV)} />
          </div>

          {/* Right: Results */}
          <div className="flex flex-col gap-2.5">
            {matches.length > 0 && matches.map((match, i) => (
              <ResultCard key={`${match.key}-${i}`} match={match} />
            ))}

            {hasContent && matches.length === 0 && (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/20 text-center px-6">
                <p className="text-2xl">✓</p>
                <p className="mt-2 text-sm font-medium text-zinc-400">No recognized secrets detected</p>
                <p className="mt-1 text-[12px] text-zinc-600">All keys look safe or are public</p>
              </div>
            )}

            {!hasContent && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/40 text-center px-6">
                <div className="rounded-full border border-zinc-800 bg-zinc-900 p-3 mb-3">
                  <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-600">Results appear here</p>
                <p className="mt-1 text-[12px] text-zinc-700">Paste your .env on the left</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom sections - full width */}
        <div className="mt-6 pb-14 space-y-6">
          <GitCommands filename={filename} />
          <AddService onServicesChange={setCommunityServices} />
        </div>

        <footer className="pb-8 text-center text-[11px] text-zinc-800">
          Client-side only - no data sent anywhere - no analytics - no storage
        </footer>
      </div>
    </div>
  )
}
