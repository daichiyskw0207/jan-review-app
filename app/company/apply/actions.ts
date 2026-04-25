'use server'

import { supabase } from '@/app/lib/supabase'

export type ApplyState = { success?: boolean; error?: string }

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData
): Promise<ApplyState> {
  const company_name  = (formData.get('company_name') as string)?.trim()
  const contact_name  = (formData.get('contact_name') as string)?.trim()
  const email         = (formData.get('email') as string)?.trim()
  const website       = (formData.get('website') as string)?.trim() || null
  const message       = (formData.get('message') as string)?.trim() || null

  if (!company_name || !contact_name || !email) {
    return { error: '必須項目を入力してください' }
  }

  // 同じメールで pending/approved の申請がないか確認
  const { data: existing } = await supabase
    .from('company_applications')
    .select('id, status')
    .eq('email', email)
    .in('status', ['pending', 'approved'])
    .maybeSingle()

  if (existing?.status === 'approved') {
    return { error: 'このメールアドレスはすでに承認済みです' }
  }
  if (existing?.status === 'pending') {
    return { error: 'このメールアドレスはすでに審査中です' }
  }

  const { error } = await supabase
    .from('company_applications')
    .insert({ company_name, contact_name, email, website, message })

  if (error) return { error: '申請に失敗しました。もう一度お試しください。' }

  return { success: true }
}
