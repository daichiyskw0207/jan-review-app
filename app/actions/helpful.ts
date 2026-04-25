'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'

export async function toggleHelpful(
  reviewId: number
): Promise<{ marked: boolean; error?: string }> {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()

  if (!user) {
    return { marked: false, error: 'ログインが必要です' }
  }

  const { data: existing } = await serverClient
    .from('review_helpful')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await serverClient
      .from('review_helpful')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
    revalidatePath('/')
    return { marked: false }
  } else {
    await serverClient
      .from('review_helpful')
      .insert({ review_id: reviewId, user_id: user.id })
    revalidatePath('/')
    return { marked: true }
  }
}
