export const revalidate = 0

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { supabase } from '@/app/lib/supabase'
import SortSelector from './SortSelector'
import AppHeader from '@/app/components/AppHeader'

type SortKey = 'score_desc' | 'score_asc' | 'price_asc' | 'price_desc' | 'newest'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: string }>
}

function sortProducts(products: Record<string, unknown>[], sort: SortKey) {
  return [...products].sort((a, b) => {
    switch (sort) {
      case 'score_desc': return ((b.score as number) ?? 0) - ((a.score as number) ?? 0)
      case 'score_asc':  return ((a.score as number) ?? 0) - ((b.score as number) ?? 0)
      case 'price_asc':  return ((a.price as number) ?? Infinity) - ((b.price as number) ?? Infinity)
      case 'price_desc': return ((b.price as number) ?? -Infinity) - ((a.price as number) ?? -Infinity)
      case 'newest':     return new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
      default:           return 0
    }
  })
}

export default async function CompanyPage({ params, searchParams }: Props) {
  const { id } = await params
  const { sort = 'score_desc' } = await searchParams

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (!company) notFound()

  // company_id で紐付いた商品 + store_name が会社名と一致する商品 を両方取得
  const { data: byCompanyId } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', id)
    .eq('status', 'approved')

  const { data: byStoreName } = await supabase
    .from('products')
    .select('*')
    .eq('store_name', company.name)
    .eq('status', 'approved')

  // 重複を除いてマージ
  const seen = new Set<string>()
  const products = [...(byCompanyId ?? []), ...(byStoreName ?? [])].filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  const sorted = sortProducts(products ?? [], sort as SortKey)

  const reviewCount = sorted.reduce((acc, p) => acc + ((p.review_count as number) ?? 0), 0)
  const avgScore = sorted.length > 0
    ? Math.round((sorted.reduce((acc, p) => acc + ((p.score as number) ?? 0), 0) / sorted.length) * 10) / 10
    : null

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/companies" backLabel="← 企業一覧" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* 企業紹介カード */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center text-orange-500 text-2xl font-bold">
              {company.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-0.5 inline-block"
                >
                  {company.website}
                </a>
              )}
              {company.corporate_number && (
                <a
                  href={`https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=${company.corporate_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-1"
                >
                  <span>法人番号: {company.corporate_number}</span>
                  <span className="text-gray-300">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* 説明文 */}
          {company.description && (
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">{company.description}</p>
          )}

          {/* 統計 */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{sorted.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">登録商品数</p>
            </div>
            {avgScore != null && (
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">{avgScore}</p>
                <p className="text-xs text-gray-400 mt-0.5">平均スコア</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{reviewCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">総口コミ数</p>
            </div>
          </div>
        </div>

        {/* 商品一覧 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">商品一覧</h3>
            <span className="text-xs text-gray-400">{sorted.length}件</span>
          </div>

          {/* ソートボタン */}
          <div className="mb-3">
            <Suspense>
              <SortSelector />
            </Suspense>
          </div>

          {sorted.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {sorted.map((product) => (
                <Link key={product.id as string} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      画像
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                        {product.category as string}
                      </span>
                      <p className="font-medium text-gray-900 mt-1 truncate">{product.name as string}</p>
                      {(product.price as number) != null && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          ¥{(product.price as number).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {(product.score as number) != null ? (
                        <>
                          <p className="text-lg font-bold text-gray-800">{product.score as number}</p>
                          <p className="text-orange-400 text-xs">
                            {'★'.repeat(Math.floor(product.score as number))}{'☆'.repeat(5 - Math.floor(product.score as number))}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-300">未評価</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
              <p className="text-sm">この企業の商品はまだ登録されていません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
