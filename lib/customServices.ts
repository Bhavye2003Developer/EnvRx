import type { ServiceDef, Risk } from '@/data/services'

export interface CustomService {
  id: string
  name: string
  keyPattern: string
  rotationUrl: string
  risk: Risk
  note: string
}

const STORAGE_KEY = 'envrx_custom_services'

export function toServiceDef(cs: CustomService): ServiceDef {
  let regex: RegExp
  try {
    const escaped = cs.keyPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')
    regex = new RegExp(`^${escaped}$`, 'i')
  } catch {
    regex = new RegExp(`^${cs.keyPattern}$`, 'i')
  }
  return {
    name: cs.name,
    patterns: [regex],
    rotationUrl: cs.rotationUrl,
    rotationLabel: cs.rotationUrl ? `Rotate in ${cs.name}` : 'Revoke manually',
    risk: cs.risk,
    note: cs.note || undefined,
  }
}

export function loadCustomServices(): CustomService[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomServices(services: CustomService[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services))
}

export function encodeShareUrl(services: CustomService[]): string {
  const encoded = btoa(JSON.stringify(services))
  const url = new URL(window.location.href)
  url.hash = `custom=${encoded}`
  return url.toString()
}

export function decodeShareHash(hash: string): CustomService[] | null {
  try {
    const match = hash.match(/^#?custom=(.+)/)
    if (!match) return null
    return JSON.parse(atob(match[1]))
  } catch {
    return null
  }
}

export function newCustomService(): CustomService {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: '',
    keyPattern: '',
    rotationUrl: '',
    risk: 'medium',
    note: '',
  }
}
