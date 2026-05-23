import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = url && key ? createClient(url, key) : null

export interface CommunityServiceRow {
  id: string
  name: string
  key_pattern: string
  rotation_url: string
  risk: 'high' | 'medium' | 'low'
  note: string
  created_at: string
}
