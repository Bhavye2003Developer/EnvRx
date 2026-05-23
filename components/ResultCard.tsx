'use client'

import RiskBadge from './RiskBadge'
import type { MatchedEntry } from '@/lib/matcher'
import type { Risk } from '@/data/services'

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

const leftAccent: Record<Risk, string> = {
  high: 'border-l-red-500/60',
  medium: 'border-l-orange-500/50',
  low: 'border-l-zinc-600',
}

export default function ResultCard({ match }: { match: MatchedEntry }) {
  const { service, key, value } = match
  const icon = SERVICE_ICONS[service.name] ?? '🔑'
  const isEmpty = value === ''

  return (
    <div className={`group rounded-xl border border-zinc-800/80 border-l-2 ${leftAccent[service.risk]} bg-zinc-900/60 px-5 py-4 transition-all duration-150 hover:border-zinc-700/80 hover:bg-zinc-900`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xl leading-none" aria-hidden="true">{icon}</span>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-100 text-sm">{service.name}</p>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500 truncate" title={key}>{key}</p>
          </div>
        </div>
        <RiskBadge risk={service.risk} />
      </div>

      {isEmpty && (
        <p className="mt-2.5 text-xs text-zinc-600 italic">Value is empty — key may be a placeholder.</p>
      )}

      {service.note && (
        <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-500">{service.note}</p>
      )}

      <div className="mt-3.5 flex flex-wrap gap-2">
        {service.rotationUrl ? (
          <a
            href={service.rotationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-[13px] font-medium text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/15 transition-colors"
          >
            {service.rotationLabel}
            <span className="text-red-500/60">↗</span>
          </a>
        ) : (
          <span className="inline-flex items-center rounded-lg bg-zinc-800/80 px-3 py-1.5 text-[13px] text-zinc-500">
            {service.rotationLabel}
          </span>
        )}

        {service.docs && (
          <a
            href={service.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/80 px-3 py-1.5 text-[13px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-400 transition-colors"
          >
            Docs
            <span className="text-zinc-600">↗</span>
          </a>
        )}
      </div>
    </div>
  )
}
