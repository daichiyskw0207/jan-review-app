import { redirect } from 'next/navigation'
import { getCompanyUser } from '@/app/lib/companyAuth'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import { StaffAddForm } from './StaffForm'
import StaffList from './StaffList'

export const revalidate = 0

export default async function CompanyStaffPage() {
  const cu = await getCompanyUser()
  if (!cu) redirect('/company/apply')

  const { data: staffList } = await supabaseAdmin
    .from('company_staff')
    .select('id, name, position, email, phone')
    .eq('company_id', cu.company.id)
    .order('created_at', { ascending: true })

  const count = staffList?.length ?? 0
  const MAX = 10

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">担当者管理</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {count} / {MAX} 名登録済み
        </p>
      </div>

      {/* 担当者一覧 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">👥 登録済み担当者</h2>

        {/* プログレスバー */}
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 bg-orange-400 rounded-full transition-all"
              style={{ width: `${(count / MAX) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{MAX - count}名追加可能</p>
        </div>

        <StaffList staffList={staffList ?? []} />
      </div>

      {/* 追加フォーム */}
      {count < MAX ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">➕ 担当者を追加</h2>
          <StaffAddForm />
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700">
          担当者の上限（10名）に達しています。追加するには既存の担当者を削除してください。
        </div>
      )}
    </div>
  )
}
