'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'

export async function toggleNewsletterConsent(consent: boolean) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { error } = await supabase
    .from('profiles')
    .update({
      newsletter_consent: consent,
      newsletter_consent_at: consent ? new Date().toISOString() : null,
    })
    .eq('id', user.id)

  if (error) return { error: '更新に失敗しました' }
  revalidatePath('/profile')
  return { success: true }
}
