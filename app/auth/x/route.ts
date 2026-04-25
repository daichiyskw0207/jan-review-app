import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64url')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Buffer.from(hash).toString('base64url')
}

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const state = crypto.randomUUID()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  const cookieStore = await cookies()
  cookieStore.set('x_oauth_state', state, { httpOnly: true, maxAge: 300, path: '/' })
  cookieStore.set('x_code_verifier', codeVerifier, { httpOnly: true, maxAge: 300, path: '/' })

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: `${origin}/auth/x/callback`,
    scope: 'tweet.read users.read',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const authUrl = `https://x.com/i/oauth2/authorize?${params}`
  console.log('[X OAuth] Redirecting to:', authUrl)
  return NextResponse.redirect(authUrl)
}
