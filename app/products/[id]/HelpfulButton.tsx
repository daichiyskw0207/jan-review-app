'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleHelpful } from '@/app/actions/helpful'
import { trackEvent } from '@/app/lib/gtag'

interface Props {
  reviewId: number
  initialCount: number
  initialMarked: boolean
  isLoggedIn: boolean
}

export default function HelpfulButton({
  reviewId,
  initialCount,
  initialMarked,
  isLoggedIn,
}: Props) {
  const [marked, setMarked] = useState(initialMarked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }
    const newMarked = !marked
    setMarked(newMarked)
    setCount((c) => (newMarked ? c + 1 : c - 1))
    trackEvent('helpful_click', { review_id: reviewId, action: newMarked ? 'add' : 'remove' })

    startTransition(async () => {
      const result = await toggleHelpful(reviewId)
      if (result.error) {
        setMarked(!newMarked)
        setCount((c) => (newMarked ? c - 1 : c + 1))
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={marked}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
        isPending ? 'opacity-50' : 'active:scale-95'
      } ${
        marked
          ? 'bg-orange-50 border-orange-300 text-orange-600 font-medium'
          : 'border-gray-200 text-gray-400 hover:border-orange-200 hover:text-orange-400'
      }`}
    >
      {/* 親指アップ */}
      <svg
        viewBox="0 0 16 16"
        width="13"
        height="13"
        fill={marked ? '#f97316' : 'none'}
        stroke={marked ? '#f97316' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M2 7.5h2.5v5.5H2zM5.5 7.5l2-5.5a1.5 1.5 0 011.5 1.5v2.5H12l-1 5.5H5.5V7.5z" />
      </svg>
      参考になった
      {count > 0 && (
        <span className={`font-bold tabular-nums ${marked ? 'text-orange-600' : 'text-gray-500'}`}>
          {count}
        </span>
      )}
    </button>
  )
}
