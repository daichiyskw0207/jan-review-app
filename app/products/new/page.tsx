import Link from 'next/link'
import ProductSubmitForm from './ProductSubmitForm'
import AppHeader from '@/app/components/AppHeader'

interface Props {
  searchParams: Promise<{ jan?: string }>
}

export default async function NewProductPage({ searchParams }: Props) {
  const { jan } = await searchParams
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">商品を追加</h2>
        </div>

        {/* JANコード説明 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-orange-700 font-medium mb-1">JANコードについて</p>
          <ul className="text-xs text-orange-600 space-y-1 list-disc list-inside">
            <li>JANコードあり → 外部DBで自動確認でき次第、即時公開</li>
            <li>JANコードなし → 他のユーザーによる確認投票（3票）で公開</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <ProductSubmitForm initialJan={jan} />
        </div>
      </main>
    </div>
  )
}
