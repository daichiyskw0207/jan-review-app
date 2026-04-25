import Link from 'next/link'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import SignOutButton from './SignOutButton'

export default async function AuthButton() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'ユーザー'
    const avatar = user.user_metadata?.avatar_url as string | undefined
    return (
      <div className="flex items-center gap-2">
        {/* 気になるリストへのショートカット */}
        <Link
          href="/mylist"
          aria-label="気になるリスト"
          className="text-gray-400 hover:text-orange-400 transition-colors"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
            <polygon points="10,1.5 18.5,10 10,18.5 1.5,10" />
          </svg>
        </Link>

        <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {avatar ? (
            <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {name[0]}
            </div>
          )}
          <span className="text-sm text-gray-300 max-w-[80px] truncate">{name}</span>
        </Link>
        <SignOutButton />
      </div>
    )
  }

  return (
    <Link
      href="/auth/login"
      className="text-sm bg-white text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-full font-medium transition-colors"
    >
      ログイン
    </Link>
  )
}
