import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('x_oauth_state')?.value
  const codeVerifier = cookieStore.get('x_code_verifier')?.value
  cookieStore.set('x_oauth_state', '', { maxAge: 0 })
  cookieStore.set('x_code_verifier', '', { maxAge: 0 })

  if (!code || !state || state !== savedState || !codeVerifier) {
    return NextResponse.redirect(`${origin}/auth/login?error=invalid_state`)
  }

  // X のアクセストークンを取得
  const credentials = Buffer.from(
    `${process.env.X_CLIENT_ID!}:${process.env.X_CLIENT_SECRET!}`
  ).toString('base64')

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${origin}/auth/x/callback`,
      code_verifier: codeVerifier,
    }),
  })
  const tokenData = await tokenRes.json()

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${origin}/auth/login?error=token_failed`)
  }

  // X ユーザー情報を取得
  const userRes = await fetch(
    'https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username',
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
  )
  const userData = await userRes.json()
  const xUser = userData.data

  if (!xUser?.id) {
    return NextResponse.redirect(`${origin}/auth/login?error=user_failed`)
  }

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

  const email = `x_${xUser.id}@x.local`
  const password = `x_${xUser.id}_${process.env.X_CLIENT_SECRET!.slice(0, 20)}`

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
        full_name: xUser.name,
        avatar_url: xUser.profile_image_url,
        provider: 'x',
        x_id: xUser.id,
        x_username: xUser.username,
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
