import Link from 'next/link'
import AuthButton from './AuthButton'

interface Props {
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
}

export default function AppHeader({ backHref, backLabel = '← 戻る', actions }: Props) {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link href={backHref} className="text-gray-400 hover:text-white text-sm">
              {backLabel}
            </Link>
          )}
          <Link href="/" className="text-lg font-bold tracking-wide">JAN口コミ</Link>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
