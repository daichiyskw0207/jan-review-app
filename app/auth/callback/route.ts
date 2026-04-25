import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // プロフィール未設定ならセットアップページへ
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, tutorial_completed')
          .eq('id', user.id)
          .single()
        if (!profile?.nickname) {
          // 新規ユーザー（会員登録）
          return NextResponse.redirect(`${origin}/profile/setup?ga=sign_up`)
        }
        if (!profile?.tutorial_completed) {
          return NextResponse.redirect(`${origin}/tutorial?ga=login`)
        }
      }
      // 既存ユーザー（ログイン）
      return NextResponse.redirect(`${origin}${next}${next.includes('?') ? '&' : '?'}ga=login`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
