import Link from 'next/link'
import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  category: string
  store_name?: string | null
  jan_code?: string | null
  score?: number | null
}

interface ProductSectionProps {
  title: string
  emoji: string
  description?: string
  products: Product[]
  badge?: { label: string; color: string }
  emptyMessage?: string
  href?: string
}

export default function ProductSection({
  title,
  emoji,
  description,
  products,
  badge,
  emptyMessage = 'まだ商品がありません',
  href,
}: ProductSectionProps) {
  return (
    <section>
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-bold text-gray-800">
            <span className="mr-1">{emoji}</span>{title}
          </h2>
          {href && (
            <Link href={href} className="flex items-center gap-0.5 text-xs text-orange-500 hover:text-orange-600 transition-colors font-medium">
              もっと見る
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">{emptyMessage}</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} badge={badge} />
          ))}
        </div>
      )}
    </section>
  )
}
