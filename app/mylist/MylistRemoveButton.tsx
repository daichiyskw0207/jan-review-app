'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleWantToBuy } from '@/app/actions/wantToBuy'

export default function MylistRemoveButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleRemove() {
    startTransition(async () => {
      await toggleWantToBuy(productId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      aria-label="リストから削除"
      className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-gray-800/60 hover:bg-gray-900/80 text-white flex items-center justify-center transition-colors ${
        isPending ? 'opacity-40' : ''
      }`}
    >
      <svg viewBox="0 0 12 12" width="10" height="10" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <line x1="2" y1="2" x2="10" y2="10" />
        <line x1="10" y1="2" x2="2" y2="10" />
      </svg>
    </button>
  )
}
