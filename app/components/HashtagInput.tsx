'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Hashtag {
  id: number
  name: string
  use_count: number
}

interface HashtagInputProps {
  /** hidden input に渡す name 属性 */
  inputName?: string
  max?: number
}

export default function HashtagInput({
  inputName = 'hashtags',
  max = 5,
}: HashtagInputProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Hashtag[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // # を除いた純粋な入力テキスト
  const rawInput = inputValue.startsWith('#') ? inputValue.slice(1) : inputValue

  const fetchSuggestions = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/hashtags?q=${encodeURIComponent(q)}`)
      const data: Hashtag[] = await res.json()
      // 既に選択済みのものは除外
      setSuggestions(data.filter((h) => !selected.includes(h.name)))
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [selected])

  useEffect(() => {
    if (rawInput.length === 0) {
      fetchSuggestions('')
    } else {
      const timer = setTimeout(() => fetchSuggestions(rawInput), 150)
      return () => clearTimeout(timer)
    }
  }, [rawInput, fetchSuggestions])

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function addTag(name: string) {
    const cleaned = name.replace(/^#+/, '').trim()
    if (!cleaned || cleaned.length > 15) return
    if (selected.includes(cleaned)) return
    if (selected.length >= max) return
    setSelected((prev) => [...prev, cleaned])
    setInputValue('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function removeTag(name: string) {
    setSelected((prev) => prev.filter((t) => t !== name))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ' ') && rawInput.trim()) {
      e.preventDefault()
      addTag(rawInput.trim())
    }
    if (e.key === 'Backspace' && inputValue === '' && selected.length > 0) {
      removeTag(selected[selected.length - 1])
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const canAdd = selected.length < max
  const showNewOption =
    rawInput.length > 0 &&
    rawInput.length <= 15 &&
    !suggestions.some((s) => s.name === rawInput) &&
    !selected.includes(rawInput)

  return (
    <div>
      {/* hidden input でサーバーアクションに渡す */}
      <input type="hidden" name={inputName} value={JSON.stringify(selected)} />

      {/* 選択済みタグ + 入力欄 */}
      <div
        className="min-h-[42px] w-full border border-gray-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 rounded-lg px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-text transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full border border-orange-200"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="text-orange-400 hover:text-orange-600 leading-none ml-0.5"
              aria-label={`#${tag} を削除`}
            >
              ×
            </button>
          </span>
        ))}

        {canAdd && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? '# タグを入力...' : '# 追加...'}
            maxLength={16} // # + 15文字
            className="flex-1 min-w-[100px] text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
          />
        )}
      </div>

      {/* ドロップダウン */}
      {open && canAdd && (
        <div
          ref={dropdownRef}
          className="mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-52 overflow-y-auto"
        >
          {loading && (
            <p className="text-xs text-gray-400 px-3 py-2">検索中...</p>
          )}

          {/* 新規作成候補 */}
          {showNewOption && (
            <button
              type="button"
              onClick={() => addTag(rawInput)}
              className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-orange-50 transition-colors"
            >
              <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">新規</span>
              <span className="text-sm font-medium text-gray-800">#{rawInput}</span>
              <span className="text-xs text-gray-400 ml-auto">を作成</span>
            </button>
          )}

          {/* 既存タグ候補 */}
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag.name)}
              className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-800">#{tag.name}</span>
              <span className="text-xs text-gray-400 ml-auto">{tag.use_count}件</span>
            </button>
          ))}

          {!loading && suggestions.length === 0 && !showNewOption && rawInput.length === 0 && (
            <p className="text-xs text-gray-400 px-3 py-2.5">タグを入力して新規作成できます</p>
          )}
          {!loading && suggestions.length === 0 && !showNewOption && rawInput.length > 15 && (
            <p className="text-xs text-red-400 px-3 py-2.5">タグは15文字以内にしてください</p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-1">
        最大{max}個まで ・ 各タグ15文字以内 ・ Enterまたはスペースで追加
      </p>
    </div>
  )
}
