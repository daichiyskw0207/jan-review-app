import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import AppHeader from '@/app/components/AppHeader'
import ProfileForm from './ProfileForm'

export default async function ProfileSetupPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // すでにニックネームが登録済みならトップへ
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .single()

  if (profile?.nickname) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">プロフィール設定</h1>
          <p className="text-sm text-gray-500 mb-8">
            口コミを投稿するために、プロフィールを登録してください。
          </p>
          <ProfileForm />
        </div>
      </main>
    </div>
  )
}
