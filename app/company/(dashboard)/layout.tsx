import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCompanyUser } from '@/app/lib/companyAuth'

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const cu = await getCompanyUser()

  if (!cu) {
    redirect('/company/apply')
  }

  const navItems = [
    { href: '/company/dashboard',  label: 'ダッシュボード', emoji: '📊' },
    { href: '/company/products',   label: '商品管理',       emoji: '📦' },
    { href: '/company/reviews',    label: '口コミ確認',     emoji: '💬' },
    { href: '/company/analytics',  label: '分析',           emoji: '📈' },
    { href: '/company/staff',      label: '担当者管理',     emoji: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← サイトトップ</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                {cu.company.name[0]}
              </div>
              <span className="text-sm font-bold">{cu.company.name}</span>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">企業マイページ</span>
            </div>
          </div>
        </div>
      </header>

      {/* サブナビ */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 hover:text-orange-500 hover:border-b-2 hover:border-orange-500 transition-colors"
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
