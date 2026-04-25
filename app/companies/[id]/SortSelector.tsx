'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'score_desc', label: '★ スコア高い順' },
  { value: 'score_asc',  label: '★ スコア低い順' },
  { value: 'price_asc',  label: '¥ 価格安い順' },
  { value: 'price_desc', label: '¥ 価格高い順' },
  { value: 'newest',     label: '🕐 新着順' },
] as const

export default function SortSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('sort') ?? 'score_desc'

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            current === opt.value
              ? 'bg-orange-500 border-orange-500 text-white font-medium'
              : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
