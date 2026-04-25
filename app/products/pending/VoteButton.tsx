'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { voteProduct } from './actions'

interface Props {
  productId: string
  hasVoted: boolean
}

export default function VoteButton({ productId, hasVoted }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleVote(vote: 'approve' | 'reject') {
    startTransition(async () => {
      const result = await voteProduct(productId, vote)
      if (result.success && result.newStatus === 'approved') {
        router.push(`/products/${productId}`)
      }
    })
  }

  if (hasVoted) {
    return (
      <p className="text-xs text-gray-400 mt-3 text-center">投票済みです</p>
    )
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => handleVote('approve')}
        disabled={pending}
        className="flex-1 text-sm py-2 rounded-lg border border-green-400 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {pending ? '…' : '✅ 正しい'}
      </button>
      <button
        onClick={() => handleVote('reject')}
        disabled={pending}
        className="flex-1 text-sm py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {pending ? '…' : '❌ おかしい'}
      </button>
    </div>
  )
}
