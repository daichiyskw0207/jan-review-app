import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { RADAR_AXES } from '@/app/lib/radarAxes'
import AppHeader from '@/app/components/AppHeader'

export const revalidate = 0

// レーダースコアオブジェクト間のコサイン類似度
function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const keys = RADAR_AXES.map((ax) => ax.label)
  let dot = 0, magA = 0, magB = 0
  for (const k of keys) {
    const va = a[k] ?? 0
    const vb = b[k] ?? 0
    dot += va * vb
    magA += va * va
    magB += vb * vb
  }
  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

type Product = {
  id: string
  name: string
  category: string
  store_name?: string
  jan_code?: string
  score?: number
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-3 p-3">
        <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
          画像
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.store_name && (
            <p className="text-xs text-gray-500 mt-0.5">{product.store_name}</p>
          )}
          <p className="font-medium text-gray-900 text-sm mt-0.5 truncate">{product.name}</p>
          {product.score != null && product.score > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-orange-400 text-xs">
                {'★'.repeat(Math.floor(product.score))}{'☆'.repeat(5 - Math.floor(product.score))}
              </span>
              <span className="text-xs font-bold text-gray-700">{product.score}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

interface Props {
  searchParams: Promise<{ review_id?: string }>
}

export default async function ThanksPage({ searchParams }: Props) {
  const { review_id } = await searchParams
  if (!review_id) redirect('/')

  // 投稿済みレビューを取得
  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', review_id)
    .single()

  if (!review) redirect('/')

  // レビューした商品を取得
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', review.product_id)
    .single()

  // ── 同ジャンルおすすめ ──────────────────────────────────────
  const { data: sameGenre } = await supabase
    .from('products')
    .select('*')
    .eq('category', product?.category ?? '')
    .neq('id', review.product_id)
    .order('score', { ascending: false })
    .limit(3)

  // ── クロスジャンルおすすめ（協調フィルタリング）──────────────
  let crossGenre: Product[] = []

  if (review.radar_scores) {
    // 他商品のレビュー（radar_scores あり）を全取得
    const { data: otherReviews } = await supabase
      .from('reviews')
      .select('product_id, radar_scores')
      .not('radar_scores', 'is', null)
      .neq('product_id', review.product_id)

    if (otherReviews && otherReviews.length > 0) {
      // 商品ごとに最大コサイン類似度を集計
      const simByProduct: Record<string, number> = {}
      for (const r of otherReviews) {
        if (!r.radar_scores) continue
        const sim = cosineSimilarity(review.radar_scores, r.radar_scores)
        if ((simByProduct[r.product_id] ?? -1) < sim) {
          simByProduct[r.product_id] = sim
        }
      }

      // 類似度上位の商品 ID を取得
      const topIds = Object.entries(simByProduct)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id]) => id)

      if (topIds.length > 0) {
        const { data: candidates } = await supabase
          .from('products')
          .select('*')
          .in('id', topIds)
          .neq('category', product?.category ?? '')

        // 類似度順に並び替えて上位 3 件
        crossGenre = (candidates ?? [])
          .sort((a, b) => (simByProduct[b.id] ?? 0) - (simByProduct[a.id] ?? 0))
          .slice(0, 3)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" backLabel="← トップへ" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* 完了メッセージ */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-500 text-xl font-bold">
            ✓
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">口コミを投稿しました！</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {review.user_name} さん、ありがとうございます。
            </p>
          </div>
        </div>

        {/* レビューした商品 */}
        {product && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">投稿した商品</h3>
            <ProductCard product={product} />
          </div>
        )}

        {/* 同ジャンルおすすめ */}
        {sameGenre && sameGenre.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              同じジャンルのおすすめ
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              「{product?.category}」の人気商品
            </p>
            <div className="space-y-2">
              {sameGenre.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* クロスジャンルおすすめ */}
        {crossGenre.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              あなたと似た評価をした人はこんな商品も好きです
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              評価のパターンが近いユーザーが高く評価した商品です
            </p>
            <div className="space-y-2">
              {crossGenre.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* 両方空の場合 */}
        {(!sameGenre || sameGenre.length === 0) && crossGenre.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
            <p className="text-sm">まだおすすめできる商品がありません。</p>
            <p className="text-xs mt-1">口コミが増えるとレコメンドが表示されます。</p>
          </div>
        )}

        {/* ボタン */}
        <div className="flex flex-col gap-2 pb-4">
          {product && (
            <Link
              href={`/products/${product.id}`}
              className="w-full text-center border border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 rounded-full transition-colors text-sm"
            >
              投稿した商品のページへ
            </Link>
          )}
          <Link
            href="/"
            className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors text-sm"
          >
            商品一覧へ
          </Link>
        </div>

      </main>
    </div>
  )
}
