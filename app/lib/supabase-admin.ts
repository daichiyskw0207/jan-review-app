import { createClient } from '@supabase/supabase-js'

// サービスロールキーを使う管理者クライアント（RLSをバイパス）
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
