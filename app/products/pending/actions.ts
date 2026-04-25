'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { supabase } from '@/app/lib/supabase'

const APPROVE_THRESHOLD = 3
const REJECT_THRESHOLD = 3

export type VoteResult =
  | { success: true; alreadyVoted: false; newStatus?: 'approved' | 'rejected' }
  | { success: false; alreadyVoted: true }
  | { success: false; alreadyVoted: false; error: string }

export async function voteProduct(productId: string, vote: 'approve' | 'reject'): Promise<VoteResult> {
  const cookieStore = await cookies()

  // voter_token がなければ生成してセット
  let voterToken = cookieStore.get('voter_token')?.value
  if (!voterToken) {
    voterToken = crypto.randomUUID()
    cookieStore.set('voter_token', voterToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1年
      path: '/',
    })
  }

  // 投票を挿入（UNIQUE(product_id, voter_token) で二重投票を防ぐ）
  const { error: insertError } = await supabase
    .from('product_votes')
    .insert({ product_id: productId, voter_token: voterToken, vote })

  if (insertError) {
    // 一意制約違反 = すでに投票済み
    if (insertError.code === '23505') {
      return { success: false, alreadyVoted: true }
    }
    return { success: false, alreadyVoted: false, error: '投票に失敗しました' }
  }

  // 現在の票数を集計
  const { data: votes } = await supabase
    .from('product_votes')
    .select('vote')
    .eq('product_id', productId)

  const approveCount = votes?.filter((v) => v.vote === 'approve').length ?? 0
  const rejectCount = votes?.filter((v) => v.vote === 'reject').length ?? 0

  let newStatus: 'approved' | 'rejected' | undefined

  if (approveCount >= APPROVE_THRESHOLD) {
    await supabase.from('products').update({ status: 'approved' }).eq('id', productId)
    newStatus = 'approved'
  } else if (rejectCount >= REJECT_THRESHOLD) {
    await supabase.from('products').update({ status: 'rejected' }).eq('id', productId)
    newStatus = 'rejected'
  }

  revalidatePath('/products/pending')

  return { success: true, alreadyVoted: false, newStatus }
}
