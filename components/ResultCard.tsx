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

const accentBorder: Record<Risk, string> = {
  high:   'border-l-red-500/70',
  medium: 'border-l-orange-500/60',
  low:    'border-l-zinc-600/80',
}

const accentGlow: Record<Risk, string> = {
  high:   'group-hover:shadow-red-500/5',
  medium: 'group-hover:shadow-orange-500/5',
  low:    'group-hover:shadow-zinc-500/5',
}

export default function ResultCard({ match }: { match: MatchedEntry }) {
  const { service, key, value } = match
  const icon = SERVICE_ICONS[service.name] ?? '🔑'
  const isEmpty = value === ''

  return (
    <div className={`group relative rounded-xl border border-zinc-800/70 border-l-[3px] ${accentBorder[service.risk]} bg-zinc-900/40 px-3 py-3 transition-all duration-200 hover:bg-zinc-900/80 hover:border-zinc-700/60 shadow-sm hover:shadow-lg sm:px-4 sm:py-4 ${accentGlow[service.risk]}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 sm:gap-3">
          <span className="shrink-0 text-base leading-none sm:text-lg" aria-hidden="true">{icon}</span>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-100 text-[13px] leading-tight sm:text-sm">{service.name}</p>
            <code className="mt-0.5 block font-mono text-[10px] text-zinc-500 truncate sm:text-[11px]" title={key}>{key}</code>
          </div>
        </div>
        <RiskBadge risk={service.risk} />
      </div>

      {/* Divider */}
      {(isEmpty || service.note || service.rotationUrl || service.docs) && (
        <div className="mt-3 border-t border-zinc-800/50" />
      )}

      {/* Empty value */}
      {isEmpty && (
        <p className="mt-3 text-[12px] text-zinc-600 italic">Value is empty - key may be a placeholder.</p>
      )}

      {/* Note */}
      {service.note && (
        <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">{service.note}</p>
      )}

      {/* Actions */}
      {(service.rotationUrl || service.docs) && (
        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {service.rotationUrl ? (
            <a
              href={service.rotationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[11px] font-medium text-red-400 ring-1 ring-inset ring-red-500/20 transition-colors hover:bg-red-500/20 hover:text-red-300 sm:gap-1.5 sm:px-3 sm:text-[12px]"
            >
              {service.rotationLabel}
              <span className="text-[10px] text-red-500/50">↗</span>
            </a>
          ) : (
            <span className="inline-flex items-center rounded-lg bg-zinc-800/60 px-2.5 py-1.5 text-[11px] text-zinc-500 ring-1 ring-inset ring-zinc-700/50 sm:px-3 sm:text-[12px]">
              {service.rotationLabel}
            </span>
          )}

          {service.docs && (
            <a
              href={service.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/60 px-2.5 py-1.5 text-[11px] text-zinc-500 ring-1 ring-inset ring-zinc-700/50 transition-colors hover:bg-zinc-800 hover:text-zinc-300 sm:gap-1.5 sm:px-3 sm:text-[12px]"
            >
              Security docs
              <span className="text-[10px] text-zinc-600">↗</span>
            </a>
          )}
        </div>
      )}

      {/* No rotation URL fallback */}
      {!service.rotationUrl && !service.docs && (
        <div className="mt-3">
          <span className="inline-flex items-center rounded-lg bg-zinc-800/60 px-2.5 py-1.5 text-[11px] text-zinc-500 ring-1 ring-inset ring-zinc-700/50 sm:px-3 sm:text-[12px]">
            {service.rotationLabel}
          </span>
        </div>
      )}
    </div>
  )
}
