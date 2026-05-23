import { describe, it, expect } from 'vitest'
import { matchServices } from './matcher'
import type { EnvEntry } from './parser'

describe('matchServices', () => {
  it('matches a known service key', () => {
    const entries: EnvEntry[] = [{ key: 'OPENAI_API_KEY', value: 'sk-abc', lineNumber: 1 }]
    const result = matchServices(entries)
    expect(result).toHaveLength(1)
    expect(result[0].service.name).toBe('OpenAI')
    expect(result[0].key).toBe('OPENAI_API_KEY')
    expect(result[0].value).toBe('sk-abc')
  })

  it('skips NEXT_PUBLIC_ keys', () => {
    const entries: EnvEntry[] = [{ key: 'NEXT_PUBLIC_API_URL', value: 'https://api.example.com', lineNumber: 1 }]
    const result = matchServices(entries)
    expect(result).toHaveLength(0)
  })

  it('includes entries with empty values', () => {
    const entries: EnvEntry[] = [{ key: 'STRIPE_SECRET_KEY', value: '', lineNumber: 1 }]
    const result = matchServices(entries)
    expect(result).toHaveLength(1)
    expect(result[0].service.name).toBe('Stripe')
  })

  it('sorts high risk before medium before low', () => {
    const entries: EnvEntry[] = [
      { key: 'RESEND_API_KEY', value: 're_abc', lineNumber: 2 },   // medium
      { key: 'OPENAI_API_KEY', value: 'sk-abc', lineNumber: 1 },   // high
    ]
    const result = matchServices(entries)
    expect(result[0].service.risk).toBe('high')
    expect(result[1].service.risk).toBe('medium')
  })

  it('first match wins — specific pattern beats generic fallback', () => {
    const entries: EnvEntry[] = [{ key: 'NEXTAUTH_SECRET', value: 'xyz', lineNumber: 1 }]
    const result = matchServices(entries)
    expect(result[0].service.name).toBe('Auth / Session Secret')
  })

  it('falls back to Unknown Secret for unrecognized _SECRET keys', () => {
    const entries: EnvEntry[] = [{ key: 'MY_CUSTOM_SECRET', value: 'xyz', lineNumber: 1 }]
    const result = matchServices(entries)
    expect(result[0].service.name).toBe('Unknown Secret')
  })

  it('returns empty array for unrecognized plain keys', () => {
    const entries: EnvEntry[] = [{ key: 'PORT', value: '3000', lineNumber: 1 }]
    const result = matchServices(entries)
    expect(result).toHaveLength(0)
  })

  it('returns empty array for empty input', () => {
    expect(matchServices([])).toEqual([])
  })
})
