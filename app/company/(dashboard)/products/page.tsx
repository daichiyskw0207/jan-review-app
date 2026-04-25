import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCompanyUser } from '@/app/lib/companyAuth'
import { supabase } from '@/app/lib/supabase'
import ProductImageUploader from './ProductImageUploader'
import CsvImporter from './CsvImporter'

export const revalidate = 0

export default async function CompanyProductsPage() {
  const cu = await getCompanyUser()
  if (!cu) redirect('/company/apply')

  const { data: byId } = await supabase.from('products')
    .select('id, name, category, score, image_url, jan_code, status')
    .eq('company_id', cu.company.id)
  const { data: byName } = await supabase.from('products')
    .select('id, name, category, score, image_url, jan_code, status')
    .eq('store_name', cu.company.name)

  const seen = new Set<number>()
  const products = [...(byId ?? []), ...(byName ?? [])].filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id); return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">商品管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length}件の商品</p>
        </div>
      </div>

      {/* CSVインポート */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-1">📥 JANコード一括登録（CSV）</h2>
        <p className="text-xs text-gray-400 mb-3">
          CSVフォーマット：<code className="bg-gray-100 px-1 rounded">JANコード,商品名,カテゴリ</code>（1行目はヘッダー）
        </p>
        <CsvImporter />
      </div>

      {/* 商品一覧 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-700">📦 商品一覧</h2>
        </div>
        {products.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-5 py-4">
                {/* 画像プレビュー */}
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">画像なし</div>
                  )}
                </div>

                {/* 商品情報 */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.id}`} className="text-sm font-medium text-gray-800 hover:text-orange-500 truncate block">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">{product.category}</span>
                    {product.jan_code && <span className="text-xs text-gray-400">JAN: {product.jan_code}</span>}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      product.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {product.status === 'approved' ? '公開中' : '審査中'}
                    </span>
                  </div>
                </div>

                {/* スコア */}
                <div className="text-right flex-shrink-0 mr-2">
                  {product.score != null ? (
                    <span className="text-sm font-bold text-orange-500">{(product.score as number).toFixed(1)}</span>
                  ) : (
                    <span className="text-xs text-gray-300">未評価</span>
                  )}
                </div>

                {/* 画像アップロード */}
                <ProductImageUploader productId={String(product.id)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">商品がまだ登録されていません</p>
            <p className="text-xs mt-1">CSVで一括登録するか、<Link href="/products/new" className="text-orange-500 underline">商品を個別追加</Link>してください</p>
          </div>
        )}
      </div>
    </div>
  )
}
