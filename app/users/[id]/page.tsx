import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'
import { getLevelFromPoints, getNextLevel, BADGES } from '@/app/lib/badges'

export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

const GENDER_LABEL: Record<string, string> = {
  male: '男性',
  female: '女性',
  no_answer: '回答なし',
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params

  // プロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, username, gender, prefecture, birthday')
    .eq('id', id)
    .maybeSingle()

  if (!profile) notFound()

  // ポイント・レベル
  const { data: pointsData } = await supabase
    .from('user_points')
    .select('total_points')
    .eq('user_id', id)
    .maybeSingle()

  const totalPoints = pointsData?.total_points ?? 0
  const level = getLevelFromPoints(totalPoints)
  const nextLevel = getNextLevel(totalPoints)

  // バッジ（取得済み）
  const { data: badgesData } = await supabase
    .from('user_badges')
    .select('badge_id, acquired_at')
    .eq('user_id', id)
    .order('acquired_at', { ascending: false })

  const acquiredIds = new Set((badgesData ?? []).map((b) => b.badge_id))
  const acquiredBadges = BADGES.filter((b) => acquiredIds.has(b.id))

  // 口コミ一覧（商品名付き）
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, score, comment, created_at, product_id, radar_scores, products(id, name, category, image_url)')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  // 各レビューのハッシュタグ
  const reviewIds = (reviews ?? []).map((r) => r.id)
  const { data: rh } = reviewIds.length > 0
    ? await supabase
        .from('review_hashtags')
        .select('review_id, hashtags(name)')
        .in('review_id', reviewIds)
    : { data: [] }

  const hashtagsByReview: Record<number, string[]> = {}
  for (const item of rh ?? []) {
    const tag = (item.hashtags as unknown as { name: string } | null)?.name
    if (!tag) continue
    if (!hashtagsByReview[item.review_id]) hashtagsByReview[item.review_id] = []
    hashtagsByReview[item.review_id].push(tag)
  }

  // 気になるリスト
  const { data: wantToBuy } = await supabase
    .from('user_want_to_buy')
    .select('product_id, created_at, products(id, name, category, image_url)')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  // カテゴリ別集計
  const categoryCount: Record<string, number> = {}
  const categoryScore: Record<string, number[]> = {}
  for (const r of reviews ?? []) {
    const cat = (r.products as unknown as { category: string } | null)?.category
    if (!cat) continue
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1
    if (!categoryScore[cat]) categoryScore[cat] = []
    if (r.score != null) categoryScore[cat].push(r.score)
  }
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const reviewCount = reviews?.length ?? 0
  const avgScore = reviewCount > 0
    ? Math.round((reviews!.reduce((a, r) => a + (r.score ?? 0), 0) / reviewCount) * 10) / 10
    : null

  // レベルプログレス
  const progressPct = nextLevel
    ? Math.min(100, Math.round(((totalPoints - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100))
    : 100

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── プロフィールカード ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            {/* アバター */}
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
              {level.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{profile.nickname}</h1>
                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-100 px-2 py-0.5 rounded-full font-medium">
                  Lv.{level.level} {level.label}
                </span>
              </div>

              {profile.username && (
                <p className="text-xs text-gray-400 mt-0.5">@{profile.username}</p>
              )}

              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                {profile.prefecture && <span>📍 {profile.prefecture}</span>}
                {profile.gender && profile.gender !== 'no_answer' && (
                  <span>{GENDER_LABEL[profile.gender]}</span>
                )}
              </div>

              {/* ポイントプログレス */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{totalPoints.toLocaleString()} pt</span>
                  {nextLevel && <span>次のレベル: {nextLevel.minPoints.toLocaleString()} pt</span>}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{reviewCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">口コミ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{avgScore ?? '-'}</p>
              <p className="text-xs text-gray-400 mt-0.5">平均スコア</p>
            </div>
            <div className="text-center">
              {/* ひし形アイコン + 気になる数 */}
              <div className="flex items-center justify-center gap-1">
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
                  <polygon points="8,1 15,8 8,15 1,8" fill="#f97316" />
                </svg>
                <p className="text-2xl font-bold text-gray-900">{wantToBuy?.length ?? 0}</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">気になる</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{acquiredBadges.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">バッジ</p>
            </div>
          </div>
        </div>

        {/* ── よく投稿するカテゴリ ── */}
        {topCategories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">🏷️ よく投稿するカテゴリ</h2>
            <div className="space-y-2.5">
              {topCategories.map(([cat, count]) => {
                const scores = categoryScore[cat] ?? []
                const avg = scores.length > 0
                  ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
                  : null
                const maxCount = topCategories[0][1]
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-gray-600 text-right flex-shrink-0">{cat}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-orange-200 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      >
                        <span className="text-xs text-orange-700 font-bold">{count}</span>
                      </div>
                    </div>
                    {avg !== null && (
                      <span className="text-xs text-gray-400 w-10 flex-shrink-0">★{avg}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 取得バッジ ── */}
        {acquiredBadges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">
              🏅 取得バッジ
              <span className="ml-2 text-xs font-normal text-gray-400">{acquiredBadges.length}個</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {acquiredBadges.map((badge) => (
                <div
                  key={badge.id}
                  title={badge.description}
                  className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5"
                >
                  <span className="text-base">{badge.emoji}</span>
                  <span className="text-xs font-medium text-orange-700">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 気になるリスト ── */}
        {(wantToBuy ?? []).length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                  <polygon points="8,1 15,8 8,15 1,8" fill="#f97316" />
                </svg>
                気になるリスト
              </span>
              <span className="ml-2 text-xs font-normal text-gray-400">{wantToBuy?.length}件</span>
            </h2>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {(wantToBuy ?? []).map((item) => {
                const product = (item.products as unknown) as {
                  id: string; name: string; category: string; image_url: string | null
                } | null
                if (!product) return null

                return (
                  <Link
                    key={item.product_id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    {/* 商品画像 */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    {/* 商品名 */}
                    <div className="p-2">
                      <p className="text-xs text-orange-500 font-medium truncate">{product.category}</p>
                      <p className="text-xs text-gray-800 font-medium leading-snug mt-0.5 line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 口コミ一覧 ── */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">
            💬 口コミ一覧
            <span className="ml-2 text-xs font-normal text-gray-400">{reviewCount}件</span>
          </h2>

          {(reviews ?? []).length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm py-12 text-center text-gray-400">
              <p className="text-sm">まだ口コミはありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(reviews ?? []).map((review) => {
                const product = (review.products as unknown) as {
                  id: number; name: string; category: string; image_url: string | null
                } | null

                return (
                  <div key={review.id} className="bg-white rounded-xl shadow-sm p-4">
                    {/* 商品情報 */}
                    {product && (
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center gap-3 mb-3 group"
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300 text-xs">
                            📦
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 group-hover:text-orange-500 transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                      </Link>
                    )}

                    {/* スコア・日付 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-orange-400 text-sm">
                          {'★'.repeat(Math.floor(review.score ?? 0))}
                          {'☆'.repeat(5 - Math.floor(review.score ?? 0))}
                        </span>
                        <span className="text-xs font-bold text-gray-700">{(review.score ?? 0).toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>

                    {/* コメント */}
                    {review.comment && (
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    )}

                    {/* ハッシュタグ */}
                    {(hashtagsByReview[review.id] ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hashtagsByReview[review.id].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
