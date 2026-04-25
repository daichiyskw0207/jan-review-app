import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('line_oauth_state')?.value
  cookieStore.set('line_oauth_state', '', { maxAge: 0 })

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/auth/login?error=invalid_state`)
  }

  // LINE のアクセストークンを取得
  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${origin}/auth/line/callback`,
      client_id: process.env.LINE_CHANNEL_ID!,
      client_secret: process.env.LINE_CHANNEL_SECRET!,
    }),
  })
  const tokenData = await tokenRes.json()

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${origin}/auth/login?error=token_failed`)
  }

  // LINE プロフィールを取得
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const profile = await profileRes.json()

  // LINE ユーザー ID を元に擬似メール・パスワードを生成
  const email = `line_${profile.userId}@line.local`
  const password = `line_${profile.userId}_${process.env.LINE_CHANNEL_SECRET!.slice(0, 20)}`

  // Supabase SSR クライアント（セッション書き込み用）
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

  // まずサインインを試みる
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

  if (signInError) {
    // 初回: Admin API でユーザーを作成
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: profile.displayName,
        avatar_url: profile.pictureUrl,
        provider: 'line',
        line_id: profile.userId,
      },
    })

    if (createError) {
      return NextResponse.redirect(`${origin}/auth/login?error=create_failed`)
    }

    await supabase.auth.signInWithPassword({ email, password })
  }

  // プロフィール未設定ならセットアップページへ
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname, tutorial_completed')
      .eq('id', user.id)
      .single()
    if (!profile?.nickname) {
      return NextResponse.redirect(`${origin}/profile/setup`)
    }
    if (!profile?.tutorial_completed) {
      return NextResponse.redirect(`${origin}/tutorial`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
