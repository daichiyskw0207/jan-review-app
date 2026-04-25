import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'
import GaEvent from '@/app/components/GaEvent'

export default function TutorialCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GaEvent action="tutorial_complete" />
      <AppHeader />
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎊</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          口コミ投稿完了！
        </h1>
        <p className="text-gray-500 mb-2">
          はじめての口コミありがとうございます。
        </p>
        <p className="text-gray-500 mb-10">
          これからもたくさんの口コミを投稿してみてください！
        </p>

        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full transition-colors shadow-md"
        >
          トップページへ
        </Link>
      </main>
    </div>
  )
}
