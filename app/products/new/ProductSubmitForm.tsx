'use client'

import { useActionState } from 'react'
import { submitProduct, ProductSubmitState } from './actions'

const CATEGORIES = [
  'ホットスナック',
  'コンビニ惣菜',
  'スイーツ・デザート',
  'パン・サンドイッチ',
  'ドリンク',
  'カップ麺・即席食品',
  'お菓子・スナック',
  'チルド食品',
  'アイス',
  'その他',
]

const initialState: ProductSubmitState = {}

export default function ProductSubmitForm({ initialJan }: { initialJan?: string }) {
  const [state, formAction, pending] = useActionState(submitProduct, initialState)

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

      {/* カテゴリ */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
          カテゴリ<span className="text-orange-500 ml-1">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
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
