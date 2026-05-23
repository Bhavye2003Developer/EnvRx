'use client'

import RiskBadge from './RiskBadge'
import type { MatchedEntry } from '@/lib/matcher'

const SERVICE_ICONS: Record<string, string> = {
  'OpenAI': '🤖',
  'Anthropic': '🧠',
  'Stripe': '💳',
  'AWS': '☁️',
  'GitHub': '🐙',
  'Supabase': '⚡',
  'Google / GCP': '🔵',
  'Firebase': '🔥',
  'Twilio': '📱',
  'SendGrid': '📧',
  'Slack': '💬',
  'Vercel': '▲',
  'Cloudflare': '🌩️',
  'Resend': '📨',
  'Clerk': '🔐',
  'Auth0': '🔒',
  'Upstash': '🚀',
  'HuggingFace': '🤗',
  'Replicate': '🎨',
  'Pinecone': '🌲',
  'Shopify': '🛍️',
  'Plaid': '🏦',
  'DigitalOcean': '🌊',
  'Notion': '📝',
  'Mailgun': '📬',
  'Pusher': '📡',
  'Auth / Session Secret': '🔑',
  'Database URL': '🗄️',
  'Unknown API Key': '❓',
  'Unknown Secret': '❓',
}

export default function ResultCard({ match }: { match: MatchedEntry }) {
  const { service, key, value } = match
  const icon = SERVICE_ICONS[service.name] ?? '🔑'
  const isEmpty = value === ''

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden="true">{icon}</span>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-100">{service.name}</p>
            <p className="mt-0.5 font-mono text-xs text-zinc-500 truncate">{key}</p>
          </div>
        </div>
        <RiskBadge risk={service.risk} />
      </div>

      {isEmpty && (
        <p className="mt-3 text-xs text-zinc-500 italic">Value is empty — key may be a placeholder.</p>
      )}

      {service.note && (
        <p className="mt-3 text-sm text-zinc-400">{service.note}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {service.rotationUrl ? (
          <a
            href={service.rotationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            {service.rotationLabel} ↗
          </a>
        ) : (
          <span className="inline-flex items-center rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400">
            {service.rotationLabel}
          </span>
        )}

        {service.docs && (
          <a
            href={service.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            Docs ↗
          </a>
        )}
      </div>
    </div>
  )
}
