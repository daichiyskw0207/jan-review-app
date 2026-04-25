import Link from 'next/link'

interface Product {
  id: number | string
  name: string
  category: string
  store_name?: string | null
  jan_code?: string | null
  score?: number | null
  image_url?: string | null
}

interface ProductCardProps {
  product: Product
  badge?: { label: string; color: string }
}

export default function ProductCard({ product, badge }: ProductCardProps) {
  const score = product.score ?? 0
  const stars = Math.round(score)

  return (
    <Link href={`/products/${product.id}`}>
      <div className="w-44 flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* 画像エリア */}
        <div className="w-full h-28 bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-300 text-3xl">📦</span>
          )}
          {badge && (
            <span className={`absolute top-1.5 left-1.5 text-white text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
        {/* テキストエリア */}
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
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-orange-400 text-xs">
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            </span>
            <span className="text-xs font-bold text-gray-700">
              {score > 0 ? score.toFixed(1) : '-'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
