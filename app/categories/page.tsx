import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'

export const metadata = { title: 'カテゴリから探す | ロコミー' }
export const revalidate = 3600

const CATEGORY_GROUPS = [
  {
    label: '🍱 食品・飲料',
    categories: [
      { name: 'ホットスナック',     emoji: '🌭', color: 'bg-red-50 border-red-100 text-red-700' },
      { name: 'コンビニ惣菜',       emoji: '🍱', color: 'bg-green-50 border-green-100 text-green-700' },
      { name: 'スイーツ・デザート', emoji: '🍰', color: 'bg-pink-50 border-pink-100 text-pink-700' },
      { name: 'パン・サンドイッチ', emoji: '🥖', color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
      { name: 'ドリンク',           emoji: '🥤', color: 'bg-blue-50 border-blue-100 text-blue-700' },
      { name: 'カップ麺・即席食品', emoji: '🍜', color: 'bg-orange-50 border-orange-100 text-orange-700' },
      { name: 'お菓子・スナック',   emoji: '🍿', color: 'bg-purple-50 border-purple-100 text-purple-700' },
      { name: 'チルド食品',         emoji: '🧊', color: 'bg-cyan-50 border-cyan-100 text-cyan-700' },
      { name: 'アイス',             emoji: '🍦', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
    ],
  },
  {
    label: '📱 家電',
    categories: [
      { name: 'スマートフォン・タブレット', emoji: '📱', color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { name: 'パソコン・周辺機器',         emoji: '💻', color: 'bg-slate-50 border-slate-200 text-slate-700' },
      { name: 'テレビ・映像機器',           emoji: '📺', color: 'bg-gray-50 border-gray-200 text-gray-700' },
      { name: '生活家電',                   emoji: '🏠', color: 'bg-teal-50 border-teal-100 text-teal-700' },
      { name: '調理家電',                   emoji: '🍳', color: 'bg-amber-50 border-amber-100 text-amber-700' },
      { name: 'カメラ・オーディオ',         emoji: '📷', color: 'bg-rose-50 border-rose-100 text-rose-700' },
    ],
  },
  {
    label: '🛋️ 家具・インテリア',
    categories: [
      { name: 'ソファ・チェア',   emoji: '🛋️', color: 'bg-brown-50 border-amber-200 text-amber-900' },
      { name: 'テーブル・デスク', emoji: '🪑', color: 'bg-orange-50 border-orange-200 text-orange-800' },
      { name: '収納・棚',         emoji: '🗄️', color: 'bg-lime-50 border-lime-200 text-lime-700' },
      { name: 'ベッド・寝具',     emoji: '🛏️', color: 'bg-violet-50 border-violet-100 text-violet-700' },
      { name: 'インテリア・雑貨', emoji: '🪴', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
    ],
  },
  {
    label: '📦 その他',
    categories: [
      { name: 'その他', emoji: '📦', color: 'bg-gray-50 border-gray-200 text-gray-600' },
    ],
  },
]

// 後方互換のために全カテゴリのフラットなメタ情報も保持
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {}
for (const group of CATEGORY_GROUPS) {
  for (const cat of group.categories) {
    CATEGORY_META[cat.name] = { emoji: cat.emoji, color: cat.color }
  }
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

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">カテゴリから探す</h1>
          <p className="text-sm text-gray-500">気になるジャンルの口コミをチェックしよう</p>
        </div>

        {CATEGORY_GROUPS.map((group) => (
          <section key={group.label}>
            <h2 className="text-sm font-bold text-gray-500 mb-3">{group.label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.categories.map((cat) => {
                const count = countMap[cat.name] ?? 0
                return (
                  <Link
                    key={cat.name}
                    href={`/categories/${encodeURIComponent(cat.name)}`}
                    className={`border rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-md transition-shadow ${cat.color}`}
                  >
                    <span className="text-4xl">{cat.emoji}</span>
                    <span className="text-sm font-bold text-center leading-snug">{cat.name}</span>
                    <span className="text-xs opacity-60">{count}件</span>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
