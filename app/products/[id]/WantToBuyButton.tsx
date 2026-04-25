'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleWantToBuy } from '@/app/actions/wantToBuy'

interface Props {
  productId: string
  initialCount: number
  initialSaved: boolean
  isLoggedIn: boolean
}

export default function WantToBuyButton({
  productId,
  initialCount,
  initialSaved,
  isLoggedIn,
}: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    const newSaved = !saved
    setSaved(newSaved)
    setCount((c) => (newSaved ? c + 1 : c - 1))

    startTransition(async () => {
      const result = await toggleWantToBuy(productId)
      if (result.error) {
        setSaved(!newSaved)
        setCount((c) => (newSaved ? c - 1 : c + 1))
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? '気になるリストから削除' : '気になるリストに追加'}
      className={`w-full rounded-xl flex flex-col items-center justify-center py-4 gap-1.5 transition-colors active:scale-95 ${
        isPending ? 'opacity-60' : ''
      } ${
        saved
          ? 'bg-orange-500 hover:bg-orange-600'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      {/* ひし形アイコン */}
      <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
        <polygon
          points="16,2 30,16 16,30 2,16"
          fill={saved ? 'white' : 'none'}
          stroke={saved ? 'white' : '#9ca3af'}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {!saved ? (
          <>
            <line x1="16" y1="10" x2="16" y2="22" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="10" y1="16" x2="22" y2="16" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <polyline
            points="10,16 14,21 23,11"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      <span className={`text-2xl font-bold leading-none tabular-nums ${saved ? 'text-white' : 'text-gray-800'}`}>
        {count.toLocaleString()}
      </span>
      <span className={`text-xs ${saved ? 'text-orange-100' : 'text-gray-500'}`}>
        気になる
      </span>
    </button>
  )
}
