'use client'

import { useRef, useState, useTransition } from 'react'
import { importProductsCsv } from './actions'

export default function CsvImporter() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; imported?: number } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append('csv', file)

    startTransition(async () => {
      const res = await importProductsCsv(fd)
      setResult(res)
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="text-sm border border-dashed border-gray-300 hover:border-orange-400 hover:text-orange-500 text-gray-500 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? '読み込み中...' : '📂 CSVファイルを選択'}
      </button>

      {result?.imported !== undefined && (
        <span className="text-sm text-green-600 font-medium">✅ {result.imported}件を登録しました</span>
      )}
      {result?.error && (
        <span className="text-sm text-red-500">{result.error}</span>
      )}

      <a
        href="data:text/csv;charset=utf-8,%EF%BB%BFJANコード,商品名,カテゴリ%0A4901234567890,テスト商品,お菓子・スナック"
        download="template.csv"
        className="text-xs text-gray-400 underline hover:text-orange-500"
      >
        テンプレートDL
      </a>
    </div>
  )
}
