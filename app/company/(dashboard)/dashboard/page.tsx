import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCompanyUser } from '@/app/lib/companyAuth'
import { supabase } from '@/app/lib/supabase'

export const revalidate = 0

export default async function CompanyDashboardPage() {
  const cu = await getCompanyUser()
  if (!cu) redirect('/company/apply')

  const companyId = cu.company.id
  const companyName = cu.company.name

  // 自社商品（company_id または store_name で紐付け）
  const { data: byId } = await supabase
    .from('products').select('id, name, category, score, image_url')
    .eq('company_id', companyId).eq('status', 'approved')
  const { data: byName } = await supabase
    .from('products').select('id, name, category, score, image_url')
    .eq('store_name', companyName).eq('status', 'approved')

  const seen = new Set<number>()
  const products = [...(byId ?? []), ...(byName ?? [])].filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id); return true
  })

  const productIds = products.map((p) => p.id)

  // 全口コミ
  const { data: reviews } = productIds.length > 0
    ? await supabase.from('reviews').select('id, score, created_at, product_id')
        .in('product_id', productIds).order('created_at', { ascending: false })
    : { data: [] }

  const totalReviews = reviews?.length ?? 0
  const avgScore = totalReviews > 0
    ? Math.round((reviews!.reduce((a, r) => a + (r.score ?? 0), 0) / totalReviews) * 10) / 10
    : null

  // 直近30日のレビュー数
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const recentCount = (reviews ?? []).filter((r) => r.created_at >= thirtyDaysAgo).length

  // スコアの高い商品トップ5
  const topProducts = [...products]
    .filter((p) => p.score != null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5)

  // 最新口コミ5件（商品名付き）
  const productMap = new Map(products.map((p) => [p.id, p.name]))
  const latestReviews = (reviews ?? []).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-0.5">{cu.company.name} のマイページ</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '登録商品数',     value: products.length,      unit: '件', color: 'text-gray-900' },
          { label: '総口コミ数',     value: totalReviews,          unit: '件', color: 'text-gray-900' },
          { label: '平均スコア',     value: avgScore ?? '-',       unit: '',   color: 'text-orange-500' },
          { label: '直近30日の口コミ', value: recentCount,         unit: '件', color: 'text-blue-500' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
            <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-base font-normal text-gray-400 ml-0.5">{kpi.unit}</span></p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 高評価商品 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">⭐ スコア上位商品</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors">
                  <span className="w-6 text-center text-sm font-bold text-gray-400">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <span className="text-sm font-bold text-orange-500">{p.score?.toFixed(1)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">まだ評価済み商品がありません</p>
          )}
          <Link href="/company/products" className="mt-4 block text-xs text-orange-500 text-right hover:underline">
            全商品を見る →
          </Link>
        </div>

        {/* 最新口コミ */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">💬 最新の口コミ</h2>
          {latestReviews.length > 0 ? (
            <div className="space-y-3">
              {latestReviews.map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{productMap.get(r.product_id) ?? '不明'}</p>
                  </div>
                  <span className="text-orange-400 text-xs">{'★'.repeat(Math.round(r.score ?? 0))}</span>
                  <span className="text-xs text-gray-300 flex-shrink-0">
                    {new Date(r.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">まだ口コミがありません</p>
          )}
          <Link href="/company/reviews" className="mt-4 block text-xs text-orange-500 text-right hover:underline">
            全口コミを見る →
          </Link>
        </div>
      </div>
    </div>
  )
}
