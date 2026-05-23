'use client'

import { useState, useMemo, useRef } from 'react'
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

export default function EnvRx() {
  const [raw, setRaw] = useState('')
  const [communityServices, setCommunityServices] = useState<CommunityService[]>([])
  const resultsRef = useRef<HTMLDivElement>(null)

  const { matches, filename } = useMemo(() => {
    if (!raw.trim()) return { matches: [], filename: '.env' }
    const entries = parseEnv(raw)
    const extraDefs = communityServices.map(communityToServiceDef)
    const matches = matchServices(entries, extraDefs)
    const filename = detectFilename(raw)
    return { matches, filename }
  }, [raw, communityServices])

  const hasContent = raw.trim().length > 0
  const highCount = matches.filter(m => m.service.risk === 'high').length
  const medCount  = matches.filter(m => m.service.risk === 'medium').length
  const lowCount  = matches.filter(m => m.service.risk === 'low').length

  function handleExample() {
    setRaw(EXAMPLE_ENV)
    // On mobile, scroll to results after a tick so state has updated
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="pt-10 pb-8 lg:pt-12 lg:pb-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-900/80 px-3 py-1 text-[11px] font-medium text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            100% client-side: nothing leaves your browser
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="text-zinc-100">Env</span>
                <span style={{
                  background: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Rx</span>
              </h1>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-zinc-400">
                Paste a leaked{' '}
                <code className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[12px] text-zinc-200">.env</code>{' '}
                file and get rotation links with git purge commands instantly.
              </p>
            </div>

            {/* Risk summary pills */}
            {matches.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {highCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-red-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    {highCount} high
                  </span>
                )}
                {medCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    {medCount} medium
                  </span>
                )}
                {lowCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-700/40 px-3 py-1 text-xs font-semibold text-zinc-400 ring-1 ring-zinc-700/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    {lowCount} low
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2 lg:items-start">

          {/* LEFT: Paste */}
          <div>
            <Paste value={raw} onChange={setRaw} onExample={handleExample} />
          </div>

          {/* RIGHT: Results */}
          <div ref={resultsRef}>
            {/* Header row — matches height of paste label row so columns align */}
            <div className="mb-2.5 flex h-8 items-center justify-between">
              {matches.length > 0 ? (
                <span className="text-sm font-medium text-zinc-300">
                  {matches.length} secret{matches.length !== 1 ? 's' : ''} detected
                </span>
              ) : hasContent ? (
                <span className="text-sm font-medium text-zinc-500">Analysis complete</span>
              ) : (
                <span className="text-sm font-medium text-zinc-700">Detected secrets</span>
              )}
            </div>

            {/* Cards — fixed height, scrolls internally, no scrollbar */}
            <div className="overflow-y-auto" style={{ maxHeight: '360px' }}>
              {matches.length > 0 && (
                <div className="flex flex-col gap-2.5 pb-1">
                  {matches.map((match, i) => (
                    <ResultCard key={`${match.key}-${i}`} match={match} />
                  ))}
                </div>
              )}

              {hasContent && matches.length === 0 && (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-6 text-center">
                  <p className="text-2xl">✓</p>
                  <p className="mt-2 text-sm font-medium text-zinc-400">No recognized secrets detected</p>
                  <p className="mt-1 text-[12px] text-zinc-600">All keys look safe or are intentionally public</p>
                </div>
              )}

              {!hasContent && (
                <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/40 px-6 text-center">
                  <div className="mb-3 rounded-full border border-zinc-800 bg-zinc-900 p-3">
                    <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-zinc-600">Results appear here</p>
                  <p className="mt-1 text-[12px] text-zinc-700">Paste your .env on the left to scan for leaked secrets</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width bottom sections */}
        <div className="mt-8 space-y-6 pb-14">
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
