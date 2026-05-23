'use client'

import type { Risk } from '@/data/services'

const config: Record<Risk, { dot: string; text: string; bg: string; ring: string; label: string }> = {
  high:   { dot: 'bg-red-400',    text: 'text-red-400',    bg: 'bg-red-500/10',    ring: 'ring-red-500/25',    label: 'HIGH' },
  medium: { dot: 'bg-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/10', ring: 'ring-orange-500/25', label: 'MED' },
  low:    { dot: 'bg-zinc-500',   text: 'text-zinc-400',   bg: 'bg-zinc-700/30',   ring: 'ring-zinc-600/30',   label: 'LOW' },
}

export default function RiskBadge({ risk }: { risk: Risk }) {
  const c = config[risk]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
