import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-bold text-orange-500 text-lg">ロコミー</Link>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-7xl font-black text-orange-400 mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">ページが見つかりません</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          お探しのページは移動・削除されたか、<br />
          URLが間違っている可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
        >
          トップへ戻る
        </Link>
      </main>
    </div>
  )
}
