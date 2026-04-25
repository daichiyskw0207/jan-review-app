'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'

export async function toggleWantToBuy(
  productId: string
): Promise<{ saved: boolean; error?: string }> {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()

  if (!user) {
    return { saved: false, error: 'ログインが必要です' }
  }

  // すでに登録済みか確認
  const { data: existing } = await serverClient
    .from('user_want_to_buy')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    // 削除（リストから外す）
    await serverClient
      .from('user_want_to_buy')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    revalidatePath(`/products/${productId}`)
    revalidatePath(`/users/${user.id}`)
    return { saved: false }
  } else {
    // 追加
    await serverClient
      .from('user_want_to_buy')
      .insert({ user_id: user.id, product_id: productId })

    revalidatePath(`/products/${productId}`)
    revalidatePath(`/users/${user.id}`)
    return { saved: true }
  }
}
