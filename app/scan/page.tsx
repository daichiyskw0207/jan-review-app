import AppHeader from '@/app/components/AppHeader'
import ScannerClient from './ScannerClient'

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" backLabel="← ホーム" />

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">バーコードをスキャン</h2>
          <p className="text-sm text-gray-500 mt-1">商品のバーコードを読み取って口コミを検索します</p>
        </div>

        <ScannerClient />
      </main>
    </div>
  )
}
