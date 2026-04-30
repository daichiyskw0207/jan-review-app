import Link from 'next/link'
import Image from 'next/image'
import LoginButtons from './LoginButtons'

interface Props {
  searchParams: Promise<{ error?: string }>
}

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed:    '認証に失敗しました。もう一度お試しください。',
  invalid_state:  '不正なリクエストです。もう一度お試しください。',
  token_failed:   'トークンの取得に失敗しました。',
  create_failed:  'アカウントの作成に失敗しました。',
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm transition-colors">← 戻る</Link>
          <Link href="/">
            <Image src="/logo.png" alt="ロコミー" width={120} height={40} style={{ height: '32px', width: 'auto' }} priority />
          </Link>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">ログイン / 会員登録</h2>
          <p className="text-sm text-gray-500 mt-2">
            アカウントをお持ちでない場合は、<br />初回ログイン時に自動で作成されます。
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
            {ERROR_MESSAGES[error] ?? '予期しないエラーが発生しました。'}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <LoginButtons />
        </div>

        <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          ログインすることで、
          <Link href="/terms" className="underline hover:text-orange-500">利用規約</Link>および
          <Link href="/privacy" className="underline hover:text-orange-500">プライバシーポリシー</Link>に
          同意したものとみなします。
        </p>
      </main>
    </div>
  )
}
