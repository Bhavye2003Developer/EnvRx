export interface EnvEntry {
  key: string
  value: string
  lineNumber: number
}

export function parseEnv(raw: string): EnvEntry[] {
  const results: EnvEntry[] = []
  const lines = raw.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#')) continue

    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue

    const key = line.slice(0, eqIdx).trim()
    if (!key || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue

    let value = line.slice(eqIdx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    results.push({ key, value, lineNumber: i + 1 })
  }

  return results
}
