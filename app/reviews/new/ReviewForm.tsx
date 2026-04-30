'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { submitReview, ReviewFormState } from './actions'
import { getRadarAxes } from '@/app/lib/radarAxes'
import HashtagInput from '@/app/components/HashtagInput'

const initialState: ReviewFormState = {}

function StarPicker({ name, legend }: { name: string; legend: string }) {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(0)
  const display = hovered || selected

  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      {/* サーバーアクションに値を渡すための hidden input */}
      <input type="hidden" name={name} value={selected === 0 ? '' : selected} />
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setSelected(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="text-xl leading-none transition-transform hover:scale-110 focus:outline-none"
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

export default function ReviewForm({ productId, category }: { productId: string; category?: string }) {
  const [state, formAction, pending] = useActionState(submitReview, initialState)
  const radarAxes = getRadarAxes(category)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="category" value={category ?? ''} />

      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {state.message}
        </div>
      )}

      {/* ニックネーム */}
      <div>
        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1.5">
          ニックネーム<span className="text-orange-500 ml-1">*</span>
        </label>
        <input
          id="user_name"
          type="text"
          name="user_name"
          placeholder="例: たろう"
          maxLength={50}
          required
          className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
        />
        {state.errors?.user_name && (
          <p className="text-red-500 text-xs mt-1.5">{state.errors.user_name[0]}</p>
        )}
      </div>

      {/* 詳細評価（レーダーチャート用） */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            詳細評価<span className="text-orange-500 ml-1">*</span>
          </label>
          <span className="text-xs text-gray-400">各項目を★で評価してください</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          {radarAxes.map((axis) => (
            <div key={axis.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 w-32 flex-shrink-0">{axis.label}</span>
              <StarPicker name={axis.key} legend={axis.label} />
            </div>
          ))}
        </div>
        {state.errors?.radar && (
          <p className="text-red-500 text-xs mt-1.5">{state.errors.radar[0]}</p>
        )}
      </div>

      {/* 口コミ内容 */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1.5">
          口コミ<span className="text-gray-400 text-xs ml-1">（任意）</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          placeholder="この商品についての感想を書いてください（500文字以内）"
          maxLength={500}
          rows={5}
          className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors resize-none"
        />
        {state.errors?.comment && (
          <p className="text-red-500 text-xs mt-1.5">{state.errors.comment[0]}</p>
        )}
      </div>

      {/* ハッシュタグ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          ハッシュタグ<span className="text-gray-400 text-xs ml-1">（任意）</span>
        </label>
        <HashtagInput inputName="hashtags" max={5} />
      </div>

      {/* おすすめ許諾 */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="allow_recommend"
          value="true"
          defaultChecked={false}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 accent-orange-500 flex-shrink-0 cursor-pointer"
        />
        <div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            この商品に似た新商品が出たらおすすめしてほしい
          </span>
          <p className="text-xs text-gray-400 mt-0.5">
            チェックを入れると、関連商品の情報をお知らせする場合があります
          </p>
        </div>
      </label>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full transition-colors text-sm tracking-wide"
      >
        {pending ? '投稿中...' : '口コミを投稿する'}
      </button>
    </form>
  )
}
