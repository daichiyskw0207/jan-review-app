import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCompanyUser } from '@/app/lib/companyAuth'
import { supabase } from '@/app/lib/supabase'

export const revalidate = 0

export default async function CompanyReviewsPage() {
  const cu = await getCompanyUser()
  if (!cu) redirect('/company/apply')

  // 自社商品ID一覧
  const { data: byId } = await supabase.from('products').select('id, name').eq('company_id', cu.company.id)
  const { data: byName } = await supabase.from('products').select('id, name').eq('store_name', cu.company.name)

  const seen = new Set<number>()
  const products = [...(byId ?? []), ...(byName ?? [])].filter((p) => {
    if (seen.has(p.id)) return false; seen.add(p.id); return true
  })
  const productIds = products.map((p) => p.id)
  const productMap = new Map(products.map((p) => [p.id, p.name]))

  // 口コミ一覧（ハッシュタグ付き）
  const { data: reviews } = productIds.length > 0
    ? await supabase.from('reviews')
        .select('id, user_name, user_id, comment, score, created_at, product_id, radar_scores')
        .in('product_id', productIds)
        .order('created_at', { ascending: false })
        .limit(200)
    : { data: [] }

  // ハッシュタグ取得
  const reviewIds = (reviews ?? []).map((r) => r.id)
  const { data: rh } = reviewIds.length > 0
    ? await supabase.from('review_hashtags').select('review_id, hashtags(name)').in('review_id', reviewIds)
    : { data: [] }

  const hashtagsByReview: Record<number, string[]> = {}
  for (const item of rh ?? []) {
    const tag = (item.hashtags as unknown as { name: string } | null)?.name
    if (!tag) continue
    if (!hashtagsByReview[item.review_id]) hashtagsByReview[item.review_id] = []
    hashtagsByReview[item.review_id].push(tag)
  }

  // カテゴリ別ハッシュタグ集計
  const tagCounts: Record<string, number> = {}
  for (const tags of Object.values(hashtagsByReview)) {
    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    }
  }
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">口コミ確認</h1>
        <p className="text-sm text-gray-500 mt-0.5">計 {reviews?.length ?? 0}件</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ハッシュタグランキング */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3">🏷️ よく使われるタグ</h2>
          {topTags.length > 0 ? (
            <div className="space-y-2">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">#{tag}</span>
                  <span className="text-xs text-gray-400">{count}件</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">タグはまだありません</p>
          )}
        </div>

        {/* 口コミ一覧 */}
        <div className="sm:col-span-2 space-y-3">
          {(reviews ?? []).length > 0 ? (
            (reviews ?? []).map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link href={`/products/${review.product_id}`}
                      className="text-xs text-orange-500 hover:underline font-medium">
                      {productMap.get(review.product_id) ?? '不明な商品'}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        {(review.user_name as string)?.[0] ?? '?'}
                      </div>
                      {review.user_id ? (
                        <Link
                          href={`/users/${review.user_id}`}
                          className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors"
                        >
                          {review.user_name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-gray-800">{review.user_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 text-sm">
                      {'★'.repeat(Math.round(review.score ?? 0))}{'☆'.repeat(5 - Math.round(review.score ?? 0))}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{(review.score ?? 0).toFixed(1)}</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(review.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                )}

                {(hashtagsByReview[review.id] ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hashtagsByReview[review.id].map((tag) => (
                      <span key={tag} className="text-xs text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm py-16 text-center text-gray-400">
              <p className="text-sm">まだ口コミがありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
