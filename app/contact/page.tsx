'use client'

import { useState } from 'react'
import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'

const CATEGORIES = [
  { value: 'general',  label: '一般的なお問い合わせ' },
  { value: 'bug',      label: '不具合・エラーの報告' },
  { value: 'account',  label: 'アカウントに関すること' },
  { value: 'review',   label: '口コミ・コンテンツに関すること' },
  { value: 'company',  label: '企業向けサービスに関すること' },
  { value: 'other',    label: 'その他' },
]

export default function ContactPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [category, setCategory] = useState('general')
  const [message,  setMessage]  = useState('')
  const [website,  setWebsite]  = useState('') // ハニーポット
  const [status,   setStatus]   = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, category, message, website }),
    })

    if (res.ok) {
      setStatus('done')
    } else {
      const data = await res.json()
      setErrorMsg(data.error ?? '送信に失敗しました。しばらくしてからお試しください。')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppHeader backHref="/" />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-10">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 text-2xl">
              ✓
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">送信完了しました</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              お問い合わせありがとうございます。<br />
              内容を確認のうえ、通常3営業日以内にご返信いたします。
            </p>
            <Link
              href="/"
              className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
            >
              トップへ戻る
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">お問い合わせ</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            ご質問・ご意見・不具合のご報告など、お気軽にお送りください。<br />
            通常3営業日以内にご返信いたします。
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ハニーポット（非表示） */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: 'none' }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="山田 太郎"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                お問い合わせ種別
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                maxLength={2000}
                placeholder="お問い合わせ内容を入力してください"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length} / 2000</p>
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-full text-sm transition-colors"
            >
              {status === 'sending' ? '送信中...' : '送信する'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
