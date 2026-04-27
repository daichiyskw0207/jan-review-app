import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'
import ProductCard from '@/app/components/ProductCard'

export const revalidate = 60

const SORT_OPTIONS = [
  { value: 'score',     label: '評価が高い順' },
  { value: 'new',       label: '新着順' },
  { value: 'score_asc', label: '評価が低い順' },
] as const

type SortKey = typeof SORT_OPTIONS[number]['value']

interface Props {
  params: Promise<{ brand: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { brand } = await params
  const brandName = decodeURIComponent(brand)
  return { title: `${brandName}の商品口コミ | ロコミー` }
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { brand } = await params
  const { sort } = await searchParams
  const brandName = decodeURIComponent(brand)

  const sortKey: SortKey = (SORT_OPTIONS.find(o => o.value === sort)?.value) ?? 'score'

  let query = supabase
    .from('products')
    .select('id, name, category, store_name, jan_code, score')
    .eq('status', 'approved')
    .eq('store_name', brandName)

  if (sortKey === 'score') {
    query = query.order('score', { ascending: false, nullsFirst: false })
  } else if (sortKey === 'score_asc') {
    query = query.gt('score', 0).order('score', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  if (!products || products.length === 0) notFound()

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/brands" backLabel="← ブランド一覧" />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{brandName}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{products.length}件</p>
          </div>

          {/* ソート */}
          <div className="flex gap-2 flex-wrap">
            {SORT_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={`/brands/${encodeURIComponent(brandName)}?sort=${opt.value}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  sortKey === opt.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}
