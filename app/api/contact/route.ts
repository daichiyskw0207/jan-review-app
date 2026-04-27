import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const CATEGORIES: Record<string, string> = {
  general:  '一般的なお問い合わせ',
  bug:      '不具合・エラーの報告',
  account:  'アカウントに関すること',
  review:   '口コミ・コンテンツに関すること',
  company:  '企業向けサービスに関すること',
  other:    'その他',
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, category, message, website } = body

  // ハニーポット：botが埋めるフィールドが入力されていたら無視
  if (website) {
    return NextResponse.json({ ok: true })
  }

  // バリデーション
  if (!name || !email || !message) {
    return NextResponse.json({ error: '必須項目が入力されていません' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 })
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: 'メッセージは2000文字以内で入力してください' }, { status: 400 })
  }

  const categoryLabel = CATEGORIES[category] ?? 'その他'

  // 管理者への通知メール
  await transporter.sendMail({
    from: `"ロコミー お問い合わせ" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAILS,
    subject: `【お問い合わせ】${categoryLabel}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background: #f97316; padding: 16px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">新しいお問い合わせ</h2>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #f3f4f6; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px;">お名前</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">メールアドレス</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f97316;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">種別</td>
              <td style="padding: 8px 0;">${categoryLabel}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0;" />
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">メッセージ</p>
          <p style="white-space: pre-wrap; line-height: 1.7; margin: 0;">${message}</p>
        </div>
      </div>
    `,
  })

  // ユーザーへの自動返信メール
  await transporter.sendMail({
    from: `"ロコミー" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '【ロコミー】お問い合わせを受け付けました',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">お問い合わせありがとうございます</h1>
        </div>
        <div style="background: white; padding: 28px; border: 1px solid #f3f4f6; border-radius: 0 0 12px 12px;">
          <p>${name} さん、こんにちは。</p>
          <p style="line-height: 1.7;">
            この度はロコミーへお問い合わせいただきありがとうございます。<br />
            内容を確認のうえ、通常3営業日以内にご返信いたします。
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
            <p style="margin: 0 0 8px; color: #6b7280; font-weight: bold;">お問い合わせ内容</p>
            <p style="margin: 0 0 4px;"><span style="color: #6b7280;">種別：</span>${categoryLabel}</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0;">
            このメールは自動送信です。このメールへの返信はできません。
          </p>
        </div>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
