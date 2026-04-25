'use client'

import Link from 'next/link'

interface Props {
  reviewCount: number
  avgScore: number | null
}

export default function LoginWall({ reviewCount, avgScore }: Props) {
  return (
    <div className="relative">
      {/* ぼかしプレースホルダー */}
      <div className="space-y-4 blur-sm pointer-events-none select-none" aria-hidden>
        {[...Array(Math.min(reviewCount, 3))].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-orange-100 rounded w-16 ml-auto" />
            </div>
            <div className="h-3 bg-orange-100 rounded w-28 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
              <div className="h-3 bg-gray-100 rounded w-3/5" />
            </div>
          </div>
        ))}
      </div>

      {/* オーバーレイ */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl">
        <div className="text-center px-6 py-8 max-w-xs">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            口コミを見るには会員登録が必要です
          </h3>
          {reviewCount > 0 && (
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-bold text-gray-700">{reviewCount}件</span>の口コミ
              {avgScore !== null && (
                <span>・平均 <span className="font-bold text-orange-500">{avgScore.toFixed(1)}</span>点</span>
              )}
              が投稿されています
            </p>
          )}
          <p className="text-xs text-gray-400 leading-relaxed mb-5">
            無料会員登録で口コミの閲覧・投稿ができます
          </p>
          <Link
            href="/auth/login"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-3 rounded-xl transition-colors mb-2"
          >
            無料で登録・ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}
