export const revalidate = 0

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { RADAR_AXES } from '@/app/lib/radarAxes'
import DynamicRadarChart from './DynamicRadarChart'
import AppHeader from '@/app/components/AppHeader'
import { getLevelFromPoints } from '@/app/lib/badges'
import { getAgeRestriction } from '@/app/lib/ageRestrictions'
import AgeWarning from './AgeWarning'
import LoginWall from './LoginWall'
import WantToBuyButton from './WantToBuyButton'
import HelpfulButton from './HelpfulButton'
import ShareButtons from './ShareButtons'
import ProductViewTracker from './ProductViewTracker'
import ProductImageUpload from './ProductImageUpload'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ new?: string }>
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const { new: isNew } = await searchParams

  // ログイン状態を確認
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  const isLoggedIn = !!user

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  // company_id → なければ store_name でも企業を検索
  const { data: company } = product.company_id
    ? await supabase.from('companies').select('id, name').eq('id', product.company_id).single()
    : product.store_name
    ? await supabase.from('companies').select('id, name').eq('name', product.store_name).maybeSingle()
    : { data: null }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: false })

  // 各レビューのハッシュタグを一括取得
  const reviewIds = (reviews ?? []).map((r) => r.id)
  const { data: reviewHashtags } = reviewIds.length > 0
    ? await supabase
        .from('review_hashtags')
        .select('review_id, hashtags(id, name)')
        .in('review_id', reviewIds)
    : { data: [] }

  // レビュー投稿者のレベル取得（user_idがあるもの）
  const reviewUserIds = (reviews ?? []).map((r) => r.user_id).filter(Boolean)
  const { data: userPointsData } = reviewUserIds.length > 0
    ? await supabase
        .from('user_points')
        .select('user_id, total_points')
        .in('user_id', reviewUserIds)
    : { data: [] }
  const levelByUserId = new Map(
    (userPointsData ?? []).map((u) => [u.user_id, getLevelFromPoints(u.total_points)])
  )

  // 参考になったデータを一括取得
  const { data: helpfulData } = reviewIds.length > 0
    ? await supabase
        .from('review_helpful')
        .select('review_id, user_id')
        .in('review_id', reviewIds)
    : { data: [] }

  const helpfulCountByReview: Record<number, number> = {}
  const userHelpfulSet = new Set<number>()
  for (const h of helpfulData ?? []) {
    helpfulCountByReview[h.review_id] = (helpfulCountByReview[h.review_id] ?? 0) + 1
    if (isLoggedIn && user && h.user_id === user.id) {
      userHelpfulSet.add(h.review_id)
    }
  }

  // review_id → ハッシュタグ名[] のマップ
  const hashtagsByReview: Record<number, string[]> = {}
  for (const rh of reviewHashtags ?? []) {
    const tag = rh.hashtags as unknown as { id: number; name: string } | null
    if (!tag) continue
    if (!hashtagsByReview[rh.review_id]) hashtagsByReview[rh.review_id] = []
    hashtagsByReview[rh.review_id].push(tag.name)
  }

  // レーダーチャート用に全レビューのradar_scoresを平均する
  const validReviews = (reviews ?? []).filter((r) => r.radar_scores)
  const radarData = RADAR_AXES.map((axis) => {
    const values = validReviews
      .map((r) => (r.radar_scores as Record<string, number>)[axis.label])
      .filter((v) => typeof v === 'number')
    const avg = values.length > 0
      ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
      : 0
    return { subject: axis.label, value: avg }
  })

  // 今度買うカウント・ログインユーザーの登録状態
  const { data: wantRows } = await supabase
    .from('user_want_to_buy')
    .select('user_id')
    .eq('product_id', id)
  const wantToBuyCount = wantRows?.length ?? 0
  const userHasSaved = isLoggedIn
    ? !!(wantRows ?? []).find((r) => r.user_id === user?.id)
    : false

  // 年齢制限チェック（DBカラム min_age 優先、次にカテゴリ名パターン）
  const ageRestriction = getAgeRestriction(product.category, product.min_age)

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <ProductViewTracker
          productId={product.id}
          productName={product.name}
          category={product.category}
        />

        {/* 新規公開バナー */}
        {isNew && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700">
            商品が公開されました！最初の口コミを投稿してみましょう。
          </div>
        )}

        {/* 商品情報 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex gap-5">
            <div className="flex-shrink-0 w-28">
              <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-300 text-4xl">📦</span>
                )}
              </div>
              {isLoggedIn && (
                <ProductImageUpload
                  productId={String(product.id)}
                  currentImageUrl={product.image_url}
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              {company ? (
                <Link
                  href={`/companies/${company.id}`}
                  className="text-sm text-orange-500 hover:underline mt-2 font-medium inline-block"
                >
                  {company.name}
                </Link>
              ) : product.store_name ? (
                <p className="text-sm text-gray-500 mt-2 font-medium">{product.store_name}</p>
              ) : null}
              <h2 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h2>
              {product.jan_code ? (
                <p className="text-sm text-gray-400 mt-1">JAN: {product.jan_code}</p>
              ) : (
                <p className="text-xs text-gray-300 mt-1">JANコードなし</p>
              )}
              {product.price != null && (
                <p className="text-sm text-gray-600 mt-1">
                  参考価格：<span className="font-bold text-gray-800">¥{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-1">（税抜）</span>
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400">
                  {'★'.repeat(Math.floor(product.score ?? 0))}{'☆'.repeat(5 - Math.floor(product.score ?? 0))}
                </span>
                <span className="text-2xl font-bold text-gray-800">{product.score ?? '-'}</span>
                <span className="text-sm text-gray-400">{(reviews ?? []).length}件のレビュー</span>
              </div>
            </div>
          </div>

          {/* アクションボタン行 (Pattern A: Filmarks風) */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            {/* 口コミボタン → 口コミ一覧へスクロール */}
            <a
              href="#reviews"
              className="flex-1 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-xl flex flex-col items-center justify-center py-4 gap-1.5 transition-colors"
            >
              <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
                <path
                  d="M4 6 Q4 4 6 4 L26 4 Q28 4 28 6 L28 19 Q28 21 26 21 L12 21 L6 28 L6 21 Q4 21 4 19 Z"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl font-bold text-gray-800 leading-none tabular-nums">
                {(reviews ?? []).length.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">口コミ</span>
            </a>

            {/* 気になるボタン */}
            <div className="flex-1">
              <WantToBuyButton
                productId={product.id}
                initialCount={wantToBuyCount}
                initialSaved={userHasSaved}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          {/* SNSシェアボタン */}
          <ShareButtons productName={product.name} productId={product.id} />
        </div>

        {/* レーダーチャート（レビューがある場合のみ） */}
        {validReviews.length > 0 && <DynamicRadarChart data={radarData} />}

        {/* 口コミ一覧 */}
        <div id="reviews" className="flex items-center justify-between mb-4 scroll-mt-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">口コミ一覧</h3>
          {isLoggedIn && (
            <Link
              href={`/reviews/new?product_id=${product.id}`}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full"
            >
              口コミを書く
            </Link>
          )}
        </div>

        {/* 未ログインは LoginWall を表示 */}
        {!isLoggedIn ? (
          <LoginWall
            reviewCount={reviews?.length ?? 0}
            avgScore={reviews && reviews.length > 0
              ? Math.round((reviews.reduce((a, r) => a + (r.score ?? 0), 0) / reviews.length) * 10) / 10
              : null}
          />
        ) : (

        /* 年齢制限コンテンツは AgeWarning でラップ */
        (() => {
          const reviewList = reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                        {(review.user_name as string)?.[0] ?? '?'}
                      </div>
                      {review.user_id ? (
                        <Link
                          href={`/users/${review.user_id}`}
                          className="font-medium text-gray-800 text-sm hover:text-orange-500 transition-colors"
                        >
                          {review.user_name}
                        </Link>
                      ) : (
                        <span className="font-medium text-gray-800 text-sm">{review.user_name}</span>
                      )}
                      {review.user_id && levelByUserId.has(review.user_id) && (() => {
                        const lvl = levelByUserId.get(review.user_id)!
                        return (
                          <span className="text-xs bg-orange-50 text-orange-500 border border-orange-100 px-1.5 py-0.5 rounded-full font-medium">
                            {lvl.emoji} Lv.{lvl.level}
                          </span>
                        )
                      })()}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div className="text-orange-400 text-sm mb-2">
                    {'★'.repeat(Math.floor(review.score))}{'☆'.repeat(5 - Math.floor(review.score))}
                    <span className="text-gray-600 font-bold ml-1">{review.score}</span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                  {/* ハッシュタグ */}
                  {(hashtagsByReview[review.id] ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(hashtagsByReview[review.id] ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-xs text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 参考になった */}
                  <div className="flex justify-end mt-3 pt-3 border-t border-gray-50">
                    <HelpfulButton
                      reviewId={review.id}
                      initialCount={helpfulCountByReview[review.id] ?? 0}
                      initialMarked={userHelpfulSet.has(review.id)}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
              <p className="text-sm">まだ口コミがありません</p>
              <p className="text-xs mt-1">最初の口コミを投稿してみましょう！</p>
            </div>
          )

          if (ageRestriction && reviews && reviews.length > 0) {
            return (
              <AgeWarning
                minAge={ageRestriction.minAge}
                categoryLabel={ageRestriction.categoryLabel}
                lawBasis={ageRestriction.lawBasis}
              >
                {reviewList}
              </AgeWarning>
            )
          }
          return reviewList
        })()
        )}
      </main>
    </div>
  )
}
