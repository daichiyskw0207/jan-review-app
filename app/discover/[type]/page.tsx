import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'
import ProductCard from '@/app/components/ProductCard'

export const revalidate = 60

const SECTION_META = {
  trending: {
    emoji: '🔥',
    title: 'トレンド',
    description: '直近7日間で口コミが集まっている商品',
    badge: { label: 'HOT', color: 'bg-red-500' },
  },
  'high-rated': {
    emoji: '⭐',
    title: '高評価',
    description: 'みんなに愛されているおすすめ商品',
    badge: { label: 'TOP', color: 'bg-orange-500' },
  },
  'low-rated': {
    emoji: '💀',
    title: '酷評',
    description: '賛否両論・要注意な商品',
    badge: { label: 'LOW', color: 'bg-gray-500' },
  },
  new: {
    emoji: '🆕',
    title: '新着',
    description: '最近登録された商品',
    badge: { label: 'NEW', color: 'bg-blue-500' },
  },
  'no-reviews': {
    emoji: '✍️',
    title: '口コミ募集中',
    description: 'あなたの一言が最初のレビューになる商品',
    badge: undefined,
  },
} as const

type SectionType = keyof typeof SECTION_META

interface Props {
  params: Promise<{ type: string }>
}

export default async function DiscoverPage({ params }: Props) {
  const { type } = await params

  if (!(type in SECTION_META)) notFound()

  const meta = SECTION_META[type as SectionType]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  let products: { id: number; name: string; category: string; store_name?: string | null; jan_code?: string | null; score?: number | null }[] = []

  if (type === 'trending') {
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select('product_id')
      .gte('created_at', sevenDaysAgo)

    const counts: Record<number, number> = {}
    for (const r of recentReviews ?? []) {
      counts[r.product_id] = (counts[r.product_id] || 0) + 1
    }
    const ids = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => Number(id))

    if (ids.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('id, name, category, store_name, jan_code, score')
        .eq('status', 'approved')
        .in('id', ids)
      products = (data ?? []).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
    }
  } else if (type === 'high-rated') {
    const { data } = await supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .gt('score', 0)
      .order('score', { ascending: false })
    products = data ?? []
  } else if (type === 'low-rated') {
    const { data } = await supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .gt('score', 0)
      .order('score', { ascending: true })
    products = data ?? []
  } else if (type === 'new') {
    const { data } = await supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    products = data ?? []
  } else if (type === 'no-reviews') {
    const { data } = await supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .or('score.is.null,score.eq.0')
      .order('created_at', { ascending: false })
    products = data ?? []
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* タイトル */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="mr-2">{meta.emoji}</span>{meta.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{meta.description}</p>
          <p className="text-xs text-gray-400 mt-1">{products.length}件</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>まだ商品がありません</p>
            <Link href="/" className="text-sm text-orange-500 mt-2 inline-block">トップに戻る</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} badge={meta.badge} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
