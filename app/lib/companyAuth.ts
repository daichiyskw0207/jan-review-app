import { createSupabaseServerClient } from './supabase-server'
import { supabase } from './supabase'

// 管理者メールアドレスリスト
const ADMIN_EMAILS = ['daichyoshik0207@gmail.com']

export async function getCompanyUser() {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return null

  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!companyUser) return null

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyUser.company_id)
    .single()

  return { user, company, role: companyUser.role }
}

export async function isAdmin() {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return false
  return ADMIN_EMAILS.includes(user.email ?? '')
}
