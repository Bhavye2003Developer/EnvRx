'use client'

import type { Risk } from '@/data/services'

const styles: Record<Risk, string> = {
  high: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  medium: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
  low: 'bg-zinc-700/50 text-zinc-400 ring-1 ring-zinc-600/30',
}

export default function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[risk]}`}>
      {risk}
    </span>
  )
}
