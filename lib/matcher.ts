import { SERVICES } from '@/data/services'
import type { ServiceDef } from '@/data/services'
import type { EnvEntry } from './parser'

export interface MatchedEntry {
  service: ServiceDef
  key: string
  value: string
}

const RISK_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

export function matchServices(entries: EnvEntry[], extraServices: ServiceDef[] = []): MatchedEntry[] {
  const results: MatchedEntry[] = []
  // Custom services checked first so user-defined patterns take priority
  const allServices = [...extraServices, ...SERVICES]

  for (const entry of entries) {
    if (/^NEXT_PUBLIC_/i.test(entry.key)) continue

    for (const service of allServices) {
      if (service.patterns.some(p => p.test(entry.key))) {
        results.push({ service, key: entry.key, value: entry.value })
        break
      }
    }
  }

  return results.sort((a, b) => RISK_ORDER[a.service.risk] - RISK_ORDER[b.service.risk])
}
