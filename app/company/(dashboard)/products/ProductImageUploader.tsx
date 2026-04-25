'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadProductImage } from './actions'

export default function ProductImageUploader({ productId }: { productId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append('product_id', productId)
    fd.append('image', file)

    startTransition(async () => {
      const result = await uploadProductImage(fd)
      if (result.error) {
        setMessage(result.error)
      } else {
        setMessage('✅ 更新しました')
      }
      setTimeout(() => setMessage(null), 3000)
    })
  }

  return (
    <div className="flex-shrink-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {message ? (
        <span className="text-xs text-green-600">{message}</span>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="text-xs border border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? '...' : '📷 画像'}
        </button>
      )}
    </div>
  )
}
