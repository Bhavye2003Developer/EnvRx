'use client'

import { useState, useMemo } from 'react'
import Paste from './Paste'
import ResultCard from './ResultCard'
import GitCommands from './GitCommands'
import { parseEnv } from '@/lib/parser'
import { matchServices } from '@/lib/matcher'

function detectFilename(raw: string): string {
  const match = raw.match(/^#\s*filename[:\s]+(\S+)/im)
  return match ? match[1] : '.env'
}

export default function EnvRx() {
  const [raw, setRaw] = useState('')

  const { matches, filename } = useMemo(() => {
    if (!raw.trim()) return { matches: [], filename: '.env' }
    const entries = parseEnv(raw)
    const matches = matchServices(entries)
    const filename = detectFilename(raw)
    return { matches, filename }
  }, [raw])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            EnvRx
          </h1>
          <p className="mt-2 text-zinc-400">
            Paste a leaked <code className="font-mono text-zinc-300">.env</code> file. Get rotation links and git purge commands instantly. Nothing leaves your browser.
          </p>
        </header>

        {/* Paste area */}
        <Paste value={raw} onChange={setRaw} />

        {/* Results */}
        {matches.length > 0 && (
          <section className="mt-8">
            <p className="mb-4 text-sm text-zinc-500">
              {matches.length} secret{matches.length !== 1 ? 's' : ''} detected
            </p>
            <div className="space-y-3">
              {matches.map((match, i) => (
                <ResultCard key={`${match.key}-${i}`} match={match} />
              ))}
            </div>
          </section>
        )}

        {raw.trim() && matches.length === 0 && (
          <p className="mt-6 text-sm text-zinc-500">No recognized secrets detected.</p>
        )}

        {/* Git commands — always shown */}
        <GitCommands filename={filename} />

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-zinc-600">
          Client-side only · No data sent anywhere · No analytics · No storage
        </footer>
      </div>
    </div>
  )
}
