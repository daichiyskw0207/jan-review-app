'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import { getCompanyUser } from '@/app/lib/companyAuth'

export type StaffState = { error?: string; success?: boolean }

export async function upsertStaff(
  _prev: StaffState,
  formData: FormData
): Promise<StaffState> {
  const cu = await getCompanyUser()
  if (!cu) return { error: '権限がありません' }

  const id       = formData.get('id') as string | null
  const name     = (formData.get('name') as string)?.trim()
  const position = (formData.get('position') as string)?.trim() || null
  const email    = (formData.get('email') as string)?.trim() || null
  const phone    = (formData.get('phone') as string)?.trim() || null

  if (!name) return { error: '氏名を入力してください' }

  // 上限チェック（新規のみ）
  if (!id) {
    const { count } = await supabaseAdmin
      .from('company_staff')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', cu.company.id)
    if ((count ?? 0) >= 10) return { error: '担当者は最大10名まで登録できます' }
  }

  if (id) {
    // 更新
    const { error } = await supabaseAdmin
      .from('company_staff')
      .update({ name, position, email, phone })
      .eq('id', Number(id))
      .eq('company_id', cu.company.id)
    if (error) return { error: '更新に失敗しました' }
  } else {
    // 新規
    const { error } = await supabaseAdmin
      .from('company_staff')
      .insert({ company_id: cu.company.id, name, position, email, phone })
    if (error) return { error: '登録に失敗しました' }
  }

  revalidatePath('/company/staff')
  return { success: true }
}

export async function deleteStaff(staffId: number): Promise<StaffState> {
  const cu = await getCompanyUser()
  if (!cu) return { error: '権限がありません' }

  await supabaseAdmin
    .from('company_staff')
    .delete()
    .eq('id', staffId)
    .eq('company_id', cu.company.id)

  revalidatePath('/company/staff')
  return { success: true }
}
