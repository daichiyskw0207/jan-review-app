import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const PROJECT_REF = 'jynrsffbmabitqdxvqci'

  const client = new Client({
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: `postgres.${PROJECT_REF}`,
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })

  try {
    await client.connect()
    await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS item_type TEXT;')
    await client.end()
    return NextResponse.json({ ok: true, message: 'item_type column added successfully' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    try { await client.end() } catch {}
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
