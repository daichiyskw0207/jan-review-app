'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { submitProduct, ProductSubmitState } from './actions'
import {
  CATEGORY_HIERARCHY,
  getSubCategories,
  getItemTypes,
} from '@/app/lib/categoryHierarchy'

const CATEGORIES = Object.keys(CATEGORY_HIERARCHY)

const initialState: ProductSubmitState = {}

export default function ProductSubmitForm({ initialJan }: { initialJan?: string }) {
  const [state, formAction, pending] = useActionState(submitProduct, initialState)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  const subCategories = selectedCategory ? getSubCategories(selectedCategory) : []
  const itemTypes = selectedCategory && selectedSubCategory
    ? getItemTypes(selectedCategory, selectedSubCategory)
    : []

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCategory(e.target.value)
    setSelectedSubCategory('')
  }

  function handleSubCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedSubCategory(e.target.value)
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {state.message}
        </div>
      )}

      {/* JANコード */}
      <div>
        <label htmlFor="jan_code" className="block text-sm font-medium text-gray-700 mb-1.5">
          JANコード
          <span className="text-gray-400 text-xs font-normal ml-1">（任意）</span>
        </label>
        <input
          id="jan_code"
          type="text"
          name="jan_code"
          defaultValue={initialJan ?? ''}
          placeholder="例: 4901234567890"
          maxLength={20}
          pattern="[0-9]*"
          inputMode="numeric"
          className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
        />
        <p className="text-xs text-orange-500 mt-1">
          JANコードを入力すると、外部データベースで自動確認され即時公開されます
        </p>
      </div>

      {/* 商品名 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
          商品名<span className="text-orange-500 ml-1">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="例: おでん（こんにゃく）"
          maxLength={100}
          required
          className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
        />
        {state.errors?.name && (
          <p className="text-red-500 text-xs mt-1.5">{state.errors.name[0]}</p>
        )}
      </div>

      {/* カテゴリ（大） */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
          カテゴリ<span className="text-orange-500 ml-1">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
        >
          <option value="" disabled>カテゴリを選択</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {state.errors?.category && (
          <p className="text-red-500 text-xs mt-1.5">{state.errors.category[0]}</p>
        )}
      </div>

      {/* サブカテゴリ（中）：カテゴリ選択後に表示 */}
      {subCategories.length > 0 && (
        <div>
          <label htmlFor="sub_category" className="block text-sm font-medium text-gray-700 mb-1.5">
            サブカテゴリ
            <span className="text-gray-400 text-xs font-normal ml-1">（任意）</span>
          </label>
          <select
            id="sub_category"
            name="sub_category"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
          >
            <option value="">選択しない</option>
            {subCategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {/* 商品タイプ（小）：サブカテゴリ選択後に表示 */}
      {itemTypes.length > 0 && (
        <div>
          <label htmlFor="item_type" className="block text-sm font-medium text-gray-700 mb-1.5">
            商品タイプ
            <span className="text-gray-400 text-xs font-normal ml-1">（任意）</span>
          </label>
          <select
            id="item_type"
            name="item_type"
            className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
          >
            <option value="">選択しない</option>
            {itemTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {/* メーカー・ブランド */}
      <div>
        <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-1.5">
          メーカー・ブランド
          <span className="text-gray-400 text-xs font-normal ml-1">（任意）</span>
        </label>
        <input
          id="store_name"
          type="text"
          name="store_name"
          placeholder="例: 明治"
          maxLength={50}
          className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
        />
      </div>

      {/* 参考価格 */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
          参考価格（税抜）
          <span className="text-gray-400 text-xs font-normal ml-1">（任意）</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
          <input
            id="price"
            type="number"
            name="price"
            placeholder="198"
            min={0}
            max={99999}
            className="w-full bg-white border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full transition-colors text-sm tracking-wide"
      >
        {pending ? '登録中...' : '商品を登録する'}
      </button>
    </form>
  )
}
