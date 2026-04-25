'use client'

import { useState } from 'react'

interface SendHistory {
  id: number
  subject: string
  sent_at: string
  recipient_count: number
  status: string
}

interface Props {
  subscriberCount: number
  history: SendHistory[]
}

const TEMPLATE_HTML = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
  <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 22px;">JAN口コミ ニュースレター</h1>
  </div>
  <div style="background: white; padding: 28px; border: 1px solid #f3f4f6; border-radius: 0 0 12px 12px;">
    <p style="margin: 0 0 16px;">{{nickname}} さん、こんにちは！</p>

    <p style="margin: 0 0 16px; line-height: 1.7;">
      本文をここに記載してください。
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="https://jan-review-pp806q8bj-daichiyskw0207s-projects.vercel.app"
         style="background: #f97316; color: white; padding: 12px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 15px;">
        JAN口コミを見る
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
      このメールはメールマガジンを希望されたユーザーにお送りしています。<br />
      配信停止は<a href="https://jan-review-pp806q8bj-daichiyskw0207s-projects.vercel.app/profile" style="color: #f97316;">プロフィール設定</a>から行えます。
    </p>
  </div>
</div>`

export default function NewsletterEditor({ subscriberCount, history }: Props) {
  const [subject, setSubject]     = useState('')
  const [bodyHtml, setBodyHtml]   = useState(TEMPLATE_HTML)
  const [tab, setTab]             = useState<'edit' | 'preview' | 'history'>('edit')
  const [sending, setSending]     = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [result, setResult]       = useState<string | null>(null)

  async function handleTest() {
    if (!subject) { setTestResult('件名を入力してください'); return }
    setSending(true)
    setTestResult(null)
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? ''}`,
      },
      body: JSON.stringify({ subject, bodyHtml, testMode: true }),
    })
    const data = await res.json()
    setTestResult(`テスト確認完了：送信対象は ${data.recipientCount} 人です`)
    setSending(false)
  }

  async function handleSend() {
    if (!subject) { setResult('件名を入力してください'); return }
    if (!confirm(`${subscriberCount}人に送信します。よろしいですか？`)) return
    setSending(true)
    setResult(null)
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? ''}`,
      },
      body: JSON.stringify({ subject, bodyHtml }),
    })
    const data = await res.json()
    if (data.error) {
      setResult(`エラー: ${data.error}`)
    } else {
      setResult(`✅ 送信完了！成功: ${data.successCount}件 / 失敗: ${data.failCount}件`)
    }
    setSending(false)
  }

  return (
    <div className="space-y-6">
      {/* 購読者サマリー */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-orange-500">{subscriberCount}</p>
          <p className="text-xs text-gray-500 mt-1">購読者数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-gray-800">{history.length}</p>
          <p className="text-xs text-gray-500 mt-1">過去の配信数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-gray-800">
            {history.length > 0
              ? history.reduce((a, h) => a + h.recipient_count, 0).toLocaleString()
              : '0'}
          </p>
          <p className="text-xs text-gray-500 mt-1">累計配信数</p>
        </div>
      </div>

      {/* タブ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(['edit', 'preview', 'history'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'edit' ? '✏️ 作成' : t === 'preview' ? '👁️ プレビュー' : '📋 送信履歴'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* 編集タブ */}
          {tab === 'edit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">件名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="例：【JAN口コミ】今月の人気商品TOP10をお届け！"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  本文HTML
                  <span className="ml-2 text-xs text-gray-400 font-normal">{'{{nickname}}'} でユーザー名に置換されます</span>
                </label>
                <textarea
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  rows={16}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleTest}
                  disabled={sending}
                  className="flex-1 border border-orange-400 text-orange-500 hover:bg-orange-50 font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  送信件数を確認
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || subscriberCount === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {sending ? '送信中...' : `${subscriberCount}人に送信`}
                </button>
              </div>

              {testResult && (
                <p className="text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-lg p-3">{testResult}</p>
              )}
              {result && (
                <p className={`text-sm rounded-lg p-3 ${result.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {result}
                </p>
              )}
            </div>
          )}

          {/* プレビュータブ */}
          {tab === 'preview' && (
            <div>
              {subject && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400">件名</p>
                  <p className="font-medium text-gray-800 mt-1">{subject}</p>
                </div>
              )}
              <div
                className="border border-gray-100 rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: bodyHtml.replace('{{nickname}}', 'テストユーザー') }}
              />
            </div>
          )}

          {/* 送信履歴タブ */}
          {tab === 'history' && (
            <div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">送信履歴はまだありません</p>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-gray-800 text-sm">{h.subject}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          h.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {h.status === 'sent' ? '送信完了' : '一部失敗'}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>📅 {new Date(h.sent_at).toLocaleString('ja-JP')}</span>
                        <span>👥 {h.recipient_count.toLocaleString()}件</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
