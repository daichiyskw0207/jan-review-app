import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'
import GaEvent from '@/app/components/GaEvent'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  if (!query) redirect('/')

  // ① product_jan_codes でJANコード完全一致
  const { data: janMatch } = await supabase
    .from('product_jan_codes')
    .select('product_id')
    .eq('jan_code', query)
    .maybeSingle()

  if (janMatch?.product_id) {
    redirect(`/products/${janMatch.product_id}`)
  }

  // ② products.jan_code でも念のため検索（旧データ対応）
  const { data: directMatch } = await supabase
    .from('products')
    .select('id')
    .eq('jan_code', query)
    .maybeSingle()

  if (directMatch?.id) {
    redirect(`/products/${directMatch.id}`)
  }

  // ③ 商品名 部分一致
  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, sub_category, store_name, score')
    .ilike('name', `%${query}%`)
    .limit(30)

  const isJanCode = /^\d{8,13}$/.test(query)

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      {/* 検索バー */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <form action="/search" method="get" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="JANコードまたは商品名で検索..."
              className="flex-1 bg-white rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              autoFocus
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-medium"
            >
              検索
            </button>
          </form>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <GaEvent action="search" params={{ search_term: query, result_count: products?.length ?? 0 }} />
        {/* JANコードで検索したが未登録の場合 */}
        {isJanCode && (!products || products.length === 0) && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-gray-700 font-medium mb-1">「{query}」は未登録の商品です</p>
            <p className="text-sm text-gray-500 mb-4">この商品を登録して最初の口コミを投稿しませんか？</p>
            <Link
              href={`/products/new?jan_code=${query}`}
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium"
            >
              この商品を登録する
            </Link>
          </div>
        )}

        {/* 検索結果 */}
        {products && products.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">「{query}」の検索結果 {products.length}件</p>
            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      画像
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1 mb-1">
                        <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                          {product.category}
                        </span>
                        {product.sub_category && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {product.sub_category}
                          </span>
                        )}
                      </div>
                      {product.store_name && (
                        <p className="text-xs text-gray-500">{product.store_name}</p>
                      )}
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-orange-400 text-xs">
                          {'★'.repeat(Math.floor(product.score || 0))}{'☆'.repeat(5 - Math.floor(product.score || 0))}
                        </span>
                        <span className="text-sm font-bold text-gray-700">{product.score || '-'}</span>
                      </div>
                    </div>
                    <span className="text-gray-300 text-lg flex-shrink-0">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          !isJanCode && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">「{query}」に一致する商品が見つかりませんでした</p>
              <p className="text-sm mt-2">別のキーワードで試してみてください</p>
            </div>
          )
        )}
      </main>
    </div>
  )
}
