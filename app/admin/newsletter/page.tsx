import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import AppHeader from '@/app/components/AppHeader'
import NewsletterEditor from './NewsletterEditor'

export const revalidate = 0

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminNewsletterPage() {
  // ログイン確認
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/')
  }

  // 購読者数取得
  const { count: subscriberCount } = await adminSupabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('newsletter_consent', true)
    .not('email', 'is', null)

  // 送信履歴取得
  const { data: history } = await adminSupabase
    .from('newsletter_sends')
    .select('id, subject, sent_at, recipient_count, status')
    .order('sent_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/admin/company-applications" />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">📧 メルマガ配信</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            メールマガジンの作成・送信・履歴管理
          </p>
        </div>

        <NewsletterEditor
          subscriberCount={subscriberCount ?? 0}
          history={history ?? []}
        />
      </main>
    </div>
  )
}
