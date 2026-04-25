'use client'

import { useState, useActionState } from 'react'
import { submitTutorialReview, TutorialFormState } from './actions'
import { RADAR_AXES } from '@/app/lib/radarAxes'

const initialState: TutorialFormState = {}

function StarPicker({ name, legend }: { name: string; legend: string }) {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(0)
  const display = hovered || selected

  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <input type="hidden" name={name} value={selected === 0 ? '' : selected} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setSelected(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none"
            style={{ color: n <= display ? '#f97316' : '#d1d5db' }}
            aria-label={`${n}点`}
          >
            {n <= display ? '★' : '☆'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

type Product = {
  id: string
  name: string
  category: string
  store_name: string | null
}

type Props = {
  product: Product
  nickname: string
}

export default function TutorialForm({ product, nickname }: Props) {
  const [state, formAction, pending] = useActionState(submitTutorialReview, initialState)
  const [comment, setComment] = useState('')

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="product_id" value={product.id} />
      <input type="hidden" name="nickname" value={nickname} />

      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {state.message}
        </div>
      )}

      {/* 商品カード */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="text-xs font-medium text-orange-500 uppercase tracking-wide mb-1">
          この商品を評価してみましょう
        </p>
        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.store_name && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {product.store_name}
            </span>
          )}
        </div>
      </div>

      {/* STEP 1: 詳細評価 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
          <h3 className="text-sm font-bold text-gray-800">各項目を★で評価しましょう</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4 ml-8">食べたり使ったりしたときの印象を思い出してみてください</p>

        <div className="space-y-4">
          {RADAR_AXES.map((axis) => (
            <div key={axis.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 w-28 flex-shrink-0">{axis.label}</span>
              <StarPicker name={axis.key} legend={axis.label} />
            </div>
          ))}
        </div>
        {state.errors?.radar && (
          <p className="text-red-500 text-xs mt-3">{state.errors.radar[0]}</p>
        )}
      </div>

      {/* STEP 2: コメント */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</span>
          <h3 className="text-sm font-bold text-gray-800">一言コメントを書きましょう</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4 ml-8">「好きな理由」「気になるところ」など、なんでもOKです！</p>

        <textarea
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="例：甘さがちょうどよくて飲みやすい！暑い日に飲みたくなります。"
          maxLength={500}
          required
          rows={4}
          className="w-full bg-gray-50 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500文字</p>
        {state.errors?.comment && (
          <p className="text-red-500 text-xs mt-1">{state.errors.comment[0]}</p>
        )}
      </div>

      {/* 投稿ボタン */}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full transition-colors text-base tracking-wide shadow-md"
      >
        {pending ? '投稿中...' : '口コミを投稿する 🎉'}
      </button>

      <p className="text-center text-xs text-gray-400">
        投稿者名は「{nickname}」で登録されます
      </p>
    </form>
  )
}
