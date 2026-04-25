export const revalidate = 0

import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'

export default async function CompaniesPage() {
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true })

  // 各会社の商品数と平均スコアを取得（company_id と store_name の両方で集計）
  const { data: products } = await supabase
    .from('products')
    .select('company_id, store_name, score')
    .eq('status', 'approved')

  // company_id → company.id で集計
  const statsMap: Record<string, { count: number; totalScore: number }> = {}

  // company名 → company.id のマップを作成
  const nameToId = Object.fromEntries((companies ?? []).map(c => [c.name, c.id]))

  for (const p of products ?? []) {
    // company_id で紐付いている場合
    const targetId = p.company_id ?? (p.store_name ? nameToId[p.store_name] : null)
    if (!targetId) continue
    if (!statsMap[targetId]) statsMap[targetId] = { count: 0, totalScore: 0 }
    statsMap[targetId].count++
    statsMap[targetId].totalScore += p.score ?? 0
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">企業一覧</h2>
          <p className="text-xs text-gray-400">{(companies ?? []).length}社が登録されています</p>
        </div>

        {companies && companies.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {companies.map((company) => {
              const stats = statsMap[company.id]
              const avgScore = stats && stats.count > 0
                ? Math.round((stats.totalScore / stats.count) * 10) / 10
                : null
              return (
                <Link key={company.id} href={`/companies/${company.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4">
                    {/* 会社アイコン */}
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center text-orange-500 text-xl font-bold">
                      {company.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{company.name}</p>
                      {company.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{company.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span>{stats?.count ?? 0}商品</span>
                        {avgScore != null && (
                          <span className="text-orange-500 font-medium">
                            ★ {avgScore} 平均
                          </span>
                        )}
                        {company.website && (
                          <span className="text-blue-400 truncate">{company.website}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 text-lg flex-shrink-0">›</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
            <p className="text-sm">まだ企業が登録されていません</p>
          </div>
        )}
      </main>
    </div>
  )
}
