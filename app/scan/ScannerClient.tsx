'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ScannerClient() {
  const router = useRouter()
  const scannerRef = useRef<InstanceType<typeof import('html5-qrcode').Html5Qrcode> | null>(null)
  const [status, setStatus] = useState<'loading' | 'scanning' | 'found' | 'error'>('loading')
  const [janCode, setJanCode] = useState('')
  const [manualInput, setManualInput] = useState('')

  useEffect(() => {
    let html5QrcodeScanner: InstanceType<typeof import('html5-qrcode').Html5Qrcode>

    const startScanner = async () => {
      const { Html5Qrcode } = await import('html5-qrcode')
      html5QrcodeScanner = new Html5Qrcode('qr-reader')
      scannerRef.current = html5QrcodeScanner

      try {
        await html5QrcodeScanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText) => {
            setJanCode(decodedText)
            setStatus('found')
            html5QrcodeScanner.stop().catch(() => {})
            // 少し待ってからページ遷移（スキャン成功を見せる）
            setTimeout(() => {
              router.push(`/search?q=${encodeURIComponent(decodedText)}`)
            }, 800)
          },
          () => {} // スキャン失敗は無視
        )
        setStatus('scanning')
      } catch {
        setStatus('error')
      }
    }

    startScanner()

    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [router])

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(manualInput.trim())}`)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* カメラビュー */}
      <div className="w-full max-w-sm">
        <div className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <div id="qr-reader" className="w-full h-full" />

          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <p className="text-white text-sm">カメラを起動中...</p>
            </div>
          )}

          {status === 'found' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-2">
              <div className="text-4xl">✅</div>
              <p className="text-white text-sm font-medium">読み取り成功！</p>
              <p className="text-orange-300 text-xs font-mono">{janCode}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-2 p-4">
              <div className="text-4xl">📷</div>
              <p className="text-white text-sm text-center">カメラへのアクセスが許可されていません</p>
              <p className="text-gray-400 text-xs text-center">下の入力欄からJANコードを入力してください</p>
            </div>
          )}

          {/* スキャンガイド枠 */}
          {status === 'scanning' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="border-2 border-orange-400 rounded-lg w-56 h-32 opacity-70" />
            </div>
          )}
        </div>

        {status === 'scanning' && (
          <p className="text-center text-sm text-gray-500 mt-2">
            バーコードをカメラに向けてください
          </p>
        )}
      </div>

      {/* 区切り */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">または手動入力</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 手動入力フォーム */}
      <form onSubmit={handleManualSearch} className="w-full max-w-sm flex gap-2">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="JANコードまたは商品名"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          inputMode="numeric"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-medium"
        >
          検索
        </button>
      </form>
    </div>
  )
}
