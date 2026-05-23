import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { CommunityServiceRow } from '@/lib/supabase'

export async function GET() {
  if (!supabase) {
    return NextResponse.json([])
  }

  const { data, error } = await supabase
    .from('community_services')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json([])
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  let body: Partial<CommunityServiceRow>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, key_pattern, rotation_url, risk, note, id } = body

  if (!name?.trim() || !key_pattern?.trim() || !id) {
    return NextResponse.json({ error: 'name, key_pattern, and id are required' }, { status: 400 })
  }

  const validRisks = ['high', 'medium', 'low']
  const safeRisk = validRisks.includes(risk ?? '') ? risk : 'medium'

  const { error } = await supabase.from('community_services').insert({
    id,
    name: name.trim(),
    key_pattern: key_pattern.trim(),
    rotation_url: rotation_url?.trim() ?? '',
    risk: safeRisk,
    note: note?.trim() ?? '',
  })

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Duplicate' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
