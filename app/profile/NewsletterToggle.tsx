'use client'

import { useState, useTransition } from 'react'
import { toggleNewsletterConsent } from '@/app/actions/newsletter'

export default function NewsletterToggle({ initialConsent }: { initialConsent: boolean }) {
  const [consent, setConsent] = useState(initialConsent)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleToggle() {
    const newConsent = !consent
    setConsent(newConsent)
    setSaved(false)
    startTransition(async () => {
      await toggleNewsletterConsent(newConsent)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-sm font-bold text-gray-700 mb-4">📧 メール設定</h2>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">メールマガジン</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            新着情報・キャンペーン・口コミトレンドをお届けします
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          aria-pressed={consent}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
            consent ? 'bg-orange-500' : 'bg-gray-200'
          } ${isPending ? 'opacity-60' : ''}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              consent ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      {saved && (
        <p className="text-xs text-green-600 mt-2">✓ 設定を保存しました</p>
      )}
      <p className="text-xs text-gray-300 mt-3 leading-relaxed">
        {consent
          ? '現在メールマガジンを受け取っています。解除はいつでも可能です。'
          : 'メールマガジンを受け取っていません。'}
      </p>
    </div>
  )
}
