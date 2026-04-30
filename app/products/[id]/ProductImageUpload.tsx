'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Props {
  productId: string
  currentImageUrl?: string | null
}

export default function ProductImageUpload({ productId, currentImageUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    const fd = new FormData()
    fd.append('image', file)
    fd.append('product_id', productId)

    const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
    const data = await res.json()

    if (res.ok) {
      setMessage({ type: 'success', text: '画像を登録しました！ありがとうございます' })
      setPreview(null)
      router.refresh()
    } else {
      setMessage({ type: 'error', text: data.error ?? 'アップロードに失敗しました' })
    }
    setUploading(false)
  }

  function handleCancel() {
    setPreview(null)
    setMessage(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  // 画像がすでに登録されている場合は表示しない
  if (currentImageUrl) return null

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 border border-dashed border-gray-300 hover:border-orange-400 rounded-lg px-3 py-2 transition-colors w-full justify-center"
        >
          📷 この商品の写真を追加する
        </button>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="relative w-full h-40 rounded overflow-hidden bg-gray-100">
            <Image src={preview} alt="プレビュー" fill className="object-contain" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-full transition-colors"
            >
              {uploading ? 'アップロード中...' : '登録する'}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="flex-1 border border-gray-300 text-gray-600 text-xs py-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className={`text-xs mt-1.5 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
