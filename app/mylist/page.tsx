import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'
import MylistRemoveButton from './MylistRemoveButton'

export const revalidate = 0

export default async function MylistPage() {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: items } = await supabase
    .from('user_want_to_buy')
    .select('product_id, created_at, products(id, name, category, store_name, image_url, score)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = items ?? []

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* タイトル */}
        <div className="flex items-center gap-2 mb-5">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
            <polygon points="10,1 19,10 10,19 1,10" fill="#f97316" />
          </svg>
          <h1 className="text-lg font-bold text-gray-900">気になるリスト</h1>
          <span className="text-sm text-gray-400 ml-1">{list.length}件</span>
        </div>

        {list.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm py-16 text-center">
            <div className="text-5xl mb-4">
              <svg viewBox="0 0 48 48" width="56" height="56" className="mx-auto" aria-hidden>
                <polygon
                  points="24,3 45,24 24,45 3,24"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <line x1="24" y1="15" x2="24" y2="33" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="24" x2="33" y2="24" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">気になる商品がまだありません</p>
            <p className="text-xs text-gray-400 mt-1">商品ページの ◆ ボタンで追加できます</p>
            <Link
              href="/"
              className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              商品を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {list.map((item) => {
              const product = (item.products as unknown) as {
                id: string
                name: string
                category: string
                store_name: string | null
                image_url: string | null
                score: number | null
              } | null
              if (!product) return null

              const score = product.score ?? 0
              const stars = Math.round(score)

              return (
                <div key={item.product_id} className="relative group">
                  <Link
                    href={`/products/${product.id}`}
                    className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* 商品画像 */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl text-gray-300">📦</span>
                      )}
                    </div>

                    {/* テキスト */}
                    <div className="p-2.5">
                      <span className="text-xs font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
                        {product.category}
                      </span>
                      {product.store_name && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{product.store_name}</p>
                      )}
                      <p className="text-sm font-medium text-gray-900 mt-0.5 line-clamp-2 leading-snug">
                        {product.name}
                      </p>
                      {score > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-orange-400 text-xs">
                            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                          </span>
                          <span className="text-xs font-bold text-gray-700">{score.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* 削除ボタン（ホバーで表示） */}
                  <MylistRemoveButton productId={item.product_id} />
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
