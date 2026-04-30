'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-bold text-orange-500 text-lg">ロコミー</Link>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-7xl font-black text-gray-300 mb-4">500</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">エラーが発生しました</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          申し訳ありません。予期しないエラーが発生しました。<br />
          しばらく時間をおいてから再度お試しください。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-block border border-orange-500 text-orange-500 hover:bg-orange-50 font-bold px-8 py-3 rounded-full text-sm transition-colors"
          >
            再試行する
          </button>
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </main>
    </div>
  )
}
