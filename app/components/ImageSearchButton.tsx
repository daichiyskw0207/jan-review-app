'use client'

import { useState } from 'react'

export default function ImageSearchButton() {
  const [showToast, setShowToast] = useState(false)

  function handleClick() {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
        title="画像で検索（近日公開）"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="11" cy="13" r="2.5"/>
          <line x1="13" y1="15" x2="15.5" y2="17.5" strokeWidth={2}/>
        </svg>
      </button>
      {showToast && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
          画像検索は近日公開予定です
        </div>
      )}
    </div>
  )
}
