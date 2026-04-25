'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import { supabase } from '@/app/lib/supabase'
import { RADAR_AXES } from '@/app/lib/radarAxes'

export type TutorialFormState = {
  errors?: {
    comment?: string[]
    radar?: string[]
  }
  message?: string
}

export async function submitTutorialReview(
  prevState: TutorialFormState,
  formData: FormData
): Promise<TutorialFormState> {
  const comment = formData.get('comment') as string
  const product_id = formData.get('product_id') as string
  const nickname = formData.get('nickname') as string

  const errors: TutorialFormState['errors'] = {}

  if (!comment || comment.trim().length === 0) {
    errors.comment = ['口コミ内容を入力してください']
  } else if (comment.trim().length > 500) {
    errors.comment = ['口コミは500文字以内で入力してください']
  }

  // レーダー軸のスコアを取得・検証
  const radarScores: Record<string, number> = {}
  let radarMissing = false
  for (const axis of RADAR_AXES) {
    const val = formData.get(axis.key) as string
    if (!val) { radarMissing = true; break }
    const n = parseInt(val, 10)
    if (isNaN(n) || n < 1 || n > 5) { radarMissing = true; break }
    radarScores[axis.label] = n
  }
  if (radarMissing) {
    errors.radar = ['すべての詳細評価を選択してください']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  const values = Object.values(radarScores)
  const score = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10

  // レビューを投稿
  const { error: reviewError } = await supabase
    .from('reviews')
    .insert({
      user_name: nickname,
      comment: comment.trim(),
      score,
      product_id,
      radar_scores: radarScores,
      allow_recommend: false,
    })

  if (reviewError) {
    return { message: '投稿に失敗しました。もう一度お試しください。' }
  }

  // チュートリアル完了フラグを立てる
  const serverSupabase = await createSupabaseServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (user) {
    await serverSupabase
      .from('profiles')
      .update({ tutorial_completed: true })
      .eq('id', user.id)
  }

  redirect('/tutorial/complete')
}
