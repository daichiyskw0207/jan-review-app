import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const state = crypto.randomUUID()

  const cookieStore = await cookies()
  cookieStore.set('line_oauth_state', state, { httpOnly: true, maxAge: 300, path: '/' })

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CHANNEL_ID!,
    redirect_uri: `${origin}/auth/line/callback`,
    state,
    scope: 'openid profile',
  })

  return NextResponse.redirect(`https://access.line.me/oauth2/v2.1/authorize?${params}`)
}
