import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'

export const metadata = { title: 'カテゴリから探す | ロコミー' }
export const revalidate = 3600

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  'ホットスナック':     { emoji: '🌭', color: 'bg-red-50 border-red-100 text-red-700' },
  'コンビニ惣菜':       { emoji: '🍱', color: 'bg-green-50 border-green-100 text-green-700' },
  'スイーツ・デザート': { emoji: '🍰', color: 'bg-pink-50 border-pink-100 text-pink-700' },
  'パン・サンドイッチ': { emoji: '🥖', color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
  'ドリンク':           { emoji: '🥤', color: 'bg-blue-50 border-blue-100 text-blue-700' },
  'カップ麺・即席食品': { emoji: '🍜', color: 'bg-orange-50 border-orange-100 text-orange-700' },
  'お菓子・スナック':   { emoji: '🍿', color: 'bg-purple-50 border-purple-100 text-purple-700' },
  'チルド食品':         { emoji: '🧊', color: 'bg-cyan-50 border-cyan-100 text-cyan-700' },
  'アイス':             { emoji: '🍦', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
  'その他':             { emoji: '📦', color: 'bg-gray-50 border-gray-200 text-gray-600' },
}

export default async function CategoriesPage() {
  // カテゴリ別の商品数を取得
  const { data: counts } = await supabase
    .from('products')
    .select('category')
    .eq('status', 'approved')

  const countMap: Record<string, number> = {}
  for (const row of counts ?? []) {
    if (row.category) countMap[row.category] = (countMap[row.category] ?? 0) + 1
  }

  const categories = Object.keys(CATEGORY_META)

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">カテゴリから探す</h1>
        <p className="text-sm text-gray-500 mb-6">気になるジャンルの口コミをチェックしよう</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat]
            const count = countMap[cat] ?? 0
            return (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat)}`}
                className={`border rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-md transition-shadow ${meta.color}`}
              >
                <span className="text-4xl">{meta.emoji}</span>
                <span className="text-sm font-bold text-center leading-snug">{cat}</span>
                <span className="text-xs opacity-60">{count}件</span>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
