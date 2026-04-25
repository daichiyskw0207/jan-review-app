import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim()

  const query = supabase
    .from('hashtags')
    .select('id, name, use_count')
    .order('use_count', { ascending: false })
    .limit(10)

  if (q) {
    query.ilike('name', `${q}%`)
  }

  const { data } = await query
  return NextResponse.json(data ?? [])
}
