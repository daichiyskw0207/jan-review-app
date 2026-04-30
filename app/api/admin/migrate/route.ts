import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Show available DB-related env vars (keys only, no values)
  const dbKeys = Object.keys(process.env).filter(k =>
    ['DATABASE', 'POSTGRES', 'SUPABASE', 'DB_'].some(p => k.includes(p))
  )
  return NextResponse.json({ available_env_keys: dbKeys })
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')

  // First: check if column already exists
  const checkResp = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=item_type&limit=1`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  )
  if (checkResp.ok) {
    return NextResponse.json({ ok: true, message: 'item_type column already exists' })
  }

  // Try pg connection with DB password if provided
  const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD
    || process.env.DATABASE_PASSWORD
    || process.env.DB_PASSWORD

  if (!DB_PASSWORD) {
    return NextResponse.json({
      ok: false,
      error: 'No DB password found. Set SUPABASE_DB_PASSWORD in Vercel env vars.',
      project_ref: PROJECT_REF,
      direct_host: `db.${PROJECT_REF}.supabase.co`,
    }, { status: 400 })
  }

  const { Client } = await import('pg')
  const hosts = [
    { host: `db.${PROJECT_REF}.supabase.co`,                    port: 5432, user: 'postgres' },
    { host: 'aws-0-ap-northeast-1.pooler.supabase.com',         port: 5432, user: `postgres.${PROJECT_REF}` },
    { host: 'aws-0-us-east-1.pooler.supabase.com',              port: 5432, user: `postgres.${PROJECT_REF}` },
    { host: 'aws-0-ap-southeast-1.pooler.supabase.com',         port: 5432, user: `postgres.${PROJECT_REF}` },
  ]

  const errors: string[] = []
  for (const { host, port, user } of hosts) {
    const client = new Client({
      host, port, database: 'postgres', user, password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    })
    try {
      await client.connect()
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS item_type TEXT;')
      await client.end()
      return NextResponse.json({ ok: true, message: `Migration successful via ${host}` })
    } catch (err) {
      errors.push(`${host}:${port} → ${err instanceof Error ? err.message : String(err)}`)
      try { await client.end() } catch {}
    }
  }
  return NextResponse.json({ ok: false, errors }, { status: 500 })
}
