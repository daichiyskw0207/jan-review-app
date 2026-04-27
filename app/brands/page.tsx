import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'

export const metadata = { title: 'ブランドから探す | ロコミー' }
export const revalidate = 3600

export default async function BrandsPage() {
  const { data: rows } = await supabase
    .from('products')
    .select('store_name')
    .eq('status', 'approved')
    .not('store_name', 'is', null)
    .neq('store_name', '')

  // ブランド別件数を集計
  const countMap: Record<string, number> = {}
  for (const row of rows ?? []) {
    if (row.store_name) {
      countMap[row.store_name] = (countMap[row.store_name] ?? 0) + 1
    }
  }

  // 件数が多い順でソート
  const brands = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])

  // 頭文字でグループ化（ひらがな・カタカナ・漢字・アルファベット）
  const groups: Record<string, [string, number][]> = {}
  for (const [brand, count] of brands) {
    const first = brand[0]
    const group = /^[ア-ン]/.test(first) ? 'ア行〜ン行'
      : /^[あ-ん]/.test(first) ? 'あ行〜ん行'
      : /^[A-Za-z]/.test(first) ? 'A-Z'
      : 'その他'
    if (!groups[group]) groups[group] = []
    groups[group].push([brand, count])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">ブランドから探す</h1>
        <p className="text-sm text-gray-500 mb-6">
          {brands.length}ブランドが登録されています
        </p>

        {brands.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>まだブランド情報が登録されていません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 人気ブランド上位10 */}
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">🏆 登録数が多いブランド</h2>
              <div className="flex flex-wrap gap-2">
                {brands.slice(0, 10).map(([brand, count]) => (
                  <Link
                    key={brand}
                    href={`/brands/${encodeURIComponent(brand)}`}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 rounded-full px-4 py-1.5 text-sm transition-colors"
                  >
                    <span>{brand}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* グループ別一覧 */}
            {Object.entries(groups).map(([group, items]) => (
              <section key={group}>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{group}</h2>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
                  {items.map(([brand, count]) => (
                    <Link
                      key={brand}
                      href={`/brands/${encodeURIComponent(brand)}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-orange-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-800">{brand}</span>
                      <span className="text-xs text-gray-400">{count}件</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
