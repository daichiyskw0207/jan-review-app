'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { submitApplication, ApplyState } from './actions'

const initial: ApplyState = {}

export default function CompanyApplyPage() {
  const [state, formAction, pending] = useActionState(submitApplication, initial)

  if (state.success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">申請を受け付けました</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            審査完了後、ご登録のメールアドレスにご連絡いたします。<br />
            通常2〜3営業日以内にご連絡します。
          </p>
          <Link href="/" className="inline-block mt-6 text-sm text-orange-500 underline">
            トップに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm transition-colors">← 戻る</Link>
          <Link href="/"><img src="/logo.png" alt="ロコミー" style={{ height: '32px', width: 'auto' }} /></Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">企業マイページ 開設申請</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            審査完了後、自社商品の口コミ確認・商品画像の登録などができるマイページをご利用いただけます。
          </p>

          <form action={formAction} className="space-y-5">
            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                企業名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                required
                placeholder="例：株式会社山田食品"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                担当者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact_name"
                required
                placeholder="例：山田 太郎"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="例：contact@yamada-foods.co.jp"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                公式サイトURL <span className="text-gray-400 text-xs">（任意）</span>
              </label>
              <input
                type="url"
                name="website"
                placeholder="例：https://yamada-foods.co.jp"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                申請メッセージ <span className="text-gray-400 text-xs">（任意）</span>
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="ご要望・ご質問などがあればご記入ください"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              申請することで、
              <Link href="/terms/company" target="_blank" className="text-orange-500 underline">企業会員利用規約</Link>
              および
              <Link href="/terms" target="_blank" className="text-orange-500 underline">一般利用規約</Link>・
              <Link href="/privacy" target="_blank" className="text-orange-500 underline">プライバシーポリシー</Link>
              に同意したものとみなします。
            </p>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {pending ? '送信中...' : '申請する'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
