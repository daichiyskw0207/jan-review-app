'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import { isAdmin } from '@/app/lib/companyAuth'

export async function approveApplication(applicationId: number, companyName: string, userEmail: string) {
  if (!(await isAdmin())) return { error: '権限がありません' }

  // 企業をcompaniesテーブルに追加（なければ）
  let companyId: string | null = null
  const { data: existingCompany } = await supabaseAdmin
    .from('companies').select('id').eq('name', companyName).maybeSingle()

  if (existingCompany) {
    companyId = existingCompany.id
  } else {
    const { data: newCompany } = await supabaseAdmin
      .from('companies').insert({ name: companyName }).select('id').single()
    companyId = newCompany?.id ?? null
  }

  if (!companyId) return { error: '企業の作成に失敗しました' }

  // ユーザーをメールアドレスで検索してcompany_usersに紐付け
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
  const targetUser = users.find((u) => u.email === userEmail)

  if (targetUser) {
    await supabaseAdmin.from('company_users').upsert({
      user_id: targetUser.id,
      company_id: companyId,
      role: 'owner',
    })
  }

  // 申請ステータスを承認に変更
  await supabaseAdmin.from('company_applications').update({
    status: 'approved',
    reviewed_at: new Date().toISOString(),
  }).eq('id', applicationId)

  revalidatePath('/admin/company-applications')
  return { success: true }
}

export async function rejectApplication(applicationId: number) {
  if (!(await isAdmin())) return { error: '権限がありません' }

  await supabaseAdmin.from('company_applications').update({
    status: 'rejected',
    reviewed_at: new Date().toISOString(),
  }).eq('id', applicationId)

  revalidatePath('/admin/company-applications')
  return { success: true }
}
