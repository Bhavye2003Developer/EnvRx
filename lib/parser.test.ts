import { describe, it, expect } from 'vitest'
import { parseEnv } from './parser'

describe('parseEnv', () => {
  it('parses simple KEY=VALUE', () => {
    const result = parseEnv('FOO=bar')
    expect(result).toEqual([{ key: 'FOO', value: 'bar', lineNumber: 1 }])
  })

  it('parses double-quoted values', () => {
    const result = parseEnv('FOO="bar baz"')
    expect(result).toEqual([{ key: 'FOO', value: 'bar baz', lineNumber: 1 }])
  })

  it('parses single-quoted values', () => {
    const result = parseEnv("FOO='bar baz'")
    expect(result).toEqual([{ key: 'FOO', value: 'bar baz', lineNumber: 1 }])
  })

  it('includes keys with empty values', () => {
    const result = parseEnv('FOO=')
    expect(result).toEqual([{ key: 'FOO', value: '', lineNumber: 1 }])
  })

  it('skips comment lines', () => {
    const result = parseEnv('# this is a comment\nFOO=bar')
    expect(result).toEqual([{ key: 'FOO', value: 'bar', lineNumber: 2 }])
  })

  it('skips empty lines', () => {
    const result = parseEnv('\nFOO=bar\n')
    expect(result).toEqual([{ key: 'FOO', value: 'bar', lineNumber: 2 }])
  })

  it('skips malformed lines silently', () => {
    const result = parseEnv('not-a-key-value\nFOO=bar')
    expect(result).toEqual([{ key: 'FOO', value: 'bar', lineNumber: 2 }])
  })

  it('tracks correct line numbers across a full file', () => {
    const input = '# comment\nFOO=1\nBAR=2'
    const result = parseEnv(input)
    expect(result[0].lineNumber).toBe(2)
    expect(result[1].lineNumber).toBe(3)
  })

  it('returns empty array for empty input', () => {
    expect(parseEnv('')).toEqual([])
  })
})
