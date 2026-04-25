'use client'

import { useState } from 'react'

interface Props {
  minAge: number
  categoryLabel: string
  lawBasis: string
  children: React.ReactNode
}

export default function AgeWarning({ minAge, categoryLabel, lawBasis, children }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return (
      <>
        {/* 閲覧中バナー（薄め） */}
        <div className="mb-4 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 text-xs text-yellow-700">
          <span className="text-base">⚠️</span>
          <p>
            この口コミは<span className="font-bold">{minAge}歳以上対象</span>の商品に関するものです。
            参考目的でのみご覧ください。
          </p>
        </div>
        {children}
      </>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* ぼかしオーバーレイ */}
      <div className="relative">
        {/* 口コミの背景（ぼかし） */}
        <div className="p-5 blur-sm pointer-events-none select-none opacity-40">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>

        {/* 警告オーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
          <div className="text-center px-6 py-8 max-w-sm">
            <div className="text-4xl mb-3">🔞</div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {minAge}歳以上対象の商品です
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-1">
              このページには<span className="font-bold text-gray-700">【{categoryLabel}】</span>
              に関する口コミが含まれています。
            </p>
            <p className="text-xs text-gray-400 leading-relaxed mb-5">
              {lawBasis}。以下の口コミはあくまでも参考情報であり、
              年齢制限の対象となる方への提供を意図したものではありません。
            </p>

            <button
              onClick={() => setDismissed(true)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-3 rounded-xl transition-colors mb-2"
            >
              {minAge}歳以上です。口コミを参考として確認する
            </button>
            <p className="text-xs text-gray-400">
              このボタンを押すことで年齢確認への同意とはなりません
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
