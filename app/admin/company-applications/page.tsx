import { redirect } from 'next/navigation'
import { isAdmin } from '@/app/lib/companyAuth'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import AppHeader from '@/app/components/AppHeader'
import ApproveButtons from './ApproveButtons'

export const revalidate = 0

export default async function AdminCompanyApplicationsPage() {
  if (!(await isAdmin())) redirect('/')

  const { data: applications } = await supabaseAdmin
    .from('company_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const pending  = (applications ?? []).filter((a) => a.status === 'pending')
  const reviewed = (applications ?? []).filter((a) => a.status !== 'pending')

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">企業申請管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">審査待ち {pending.length}件</p>
        </div>

        {/* 審査待ち */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">⏳ 審査待ち</h2>
          {pending.length > 0 ? (
            <div className="space-y-3">
              {pending.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{app.company_name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">担当者：{app.contact_name}</p>
                      <p className="text-sm text-gray-500">メール：{app.email}</p>
                      {app.website && <p className="text-xs text-blue-500 mt-0.5">{app.website}</p>}
                      {app.message && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2 leading-relaxed">{app.message}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        申請日：{new Date(app.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <ApproveButtons
                      applicationId={app.id}
                      companyName={app.company_name}
                      email={app.email}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm py-10 text-center text-gray-400">
              <p className="text-sm">審査待ちの申請はありません</p>
            </div>
          )}
        </section>

        {/* 処理済み */}
        {reviewed.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">✅ 処理済み</h2>
            <div className="space-y-2">
              {reviewed.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{app.company_name}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    app.status === 'approved'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {app.status === 'approved' ? '✓ 承認済み' : '✗ 却下'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
