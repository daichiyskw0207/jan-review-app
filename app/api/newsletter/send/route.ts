import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

// service_role キーで認証なしにDB操作するためのクライアント
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // 管理者シークレットキーで認証
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, bodyHtml, bodyText, testMode } = await req.json()
  if (!subject || !bodyHtml) {
    return NextResponse.json({ error: 'subject と bodyHtml は必須です' }, { status: 400 })
  }

  // 購読者リストを取得
  const { data: subscribers, error: dbErr } = await adminSupabase
    .from('profiles')
    .select('email, nickname')
    .eq('newsletter_consent', true)
    .not('email', 'is', null)

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  const targets = (subscribers ?? []).filter((s) => !!s.email)

  if (testMode) {
    // テストモード：実際には送らず件数だけ返す
    return NextResponse.json({ recipientCount: targets.length, testMode: true })
  }

  if (targets.length === 0) {
    return NextResponse.json({ error: '購読者が0人です' }, { status: 400 })
  }

  // Resend でバッチ送信（1件ずつ送ることで配信停止リンクにユーザー情報を埋め込める）
  const results = await Promise.allSettled(
    targets.map((sub) =>
      resend.emails.send({
        from: 'JAN口コミ <newsletter@jan-kuchikomi.jp>',
        to: sub.email!,
        subject,
        html: bodyHtml.replace('{{nickname}}', sub.nickname ?? 'ゲスト'),
        text: bodyText?.replace('{{nickname}}', sub.nickname ?? 'ゲスト'),
      })
    )
  )

  const successCount = results.filter((r) => r.status === 'fulfilled').length
  const failCount    = results.length - successCount

  // 送信履歴を記録
  await adminSupabase.from('newsletter_sends').insert({
    subject,
    body_html:        bodyHtml,
    body_text:        bodyText ?? null,
    sent_by:          'admin',
    recipient_count:  successCount,
    status:           failCount === 0 ? 'sent' : 'partial',
  })

  return NextResponse.json({ successCount, failCount })
}
