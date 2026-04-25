'use server'

import { redirect } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import { RADAR_AXES } from '@/app/lib/radarAxes'
import { processReviewGamification } from '@/app/lib/gamification'

export type ReviewFormState = {
  errors?: {
    user_name?: string[]
    comment?: string[]
    radar?: string[]
    product_id?: string[]
  }
  message?: string
}

export async function submitReview(
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const user_name = formData.get('user_name') as string
  const comment = formData.get('comment') as string
  const product_id = formData.get('product_id') as string
  const allow_recommend = formData.get('allow_recommend') === 'true'

  // ログインチェック（未ログインは投稿不可）
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) {
    return { message: '口コミの投稿には会員登録・ログインが必要です。' }
  }
  const userId = user.id

  const errors: ReviewFormState['errors'] = {}

  if (!user_name || user_name.trim().length === 0) {
    errors.user_name = ['ニックネームを入力してください']
  } else if (user_name.trim().length > 50) {
    errors.user_name = ['ニックネームは50文字以内で入力してください']
  }

  if (comment && comment.trim().length > 500) {
    errors.comment = ['口コミは500文字以内で入力してください']
  }

  if (!product_id || product_id.trim().length === 0) {
    errors.product_id = ['商品IDが指定されていません']
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

  // 総合スコア = 各軸の平均（小数点1桁に丸める）
  const values = Object.values(radarScores)
  const score = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10

  const { data: inserted, error } = await supabase
    .from('reviews')
    .insert({
      user_name: user_name.trim(),
      comment: comment?.trim() || null,
      score,
      product_id: product_id.trim(),
      radar_scores: radarScores,
      allow_recommend,
      user_id: userId,
    })
    .select('id')
    .single()

  if (error || !inserted) {
    return { message: '投稿に失敗しました。もう一度お試しください。' }
  }

  // ハッシュタグの保存
  const hashtagsRaw = formData.get('hashtags') as string
  if (hashtagsRaw) {
    try {
      const tagNames: string[] = JSON.parse(hashtagsRaw)
      for (const name of tagNames) {
        if (!name || name.length > 15) continue

        // 既存タグを検索、なければ新規作成
        let tagId: number | null = null
        const { data: existing } = await supabase
          .from('hashtags')
          .select('id')
          .eq('name', name)
          .maybeSingle()

        if (existing) {
          tagId = existing.id
        } else {
          const { data: created } = await supabase
            .from('hashtags')
            .insert({ name })
            .select('id')
            .single()
          tagId = created?.id ?? null
        }

        if (tagId) {
          // use_count を +1
          await supabase.rpc('increment_hashtag_use_count', { hashtag_id: tagId })
          // 中間テーブルに紐付け
          await supabase
            .from('review_hashtags')
            .insert({ review_id: inserted.id, hashtag_id: tagId })
        }
      }
    } catch {
      // ハッシュタグ保存失敗はレビュー投稿の失敗にしない（ベストエフォート）
    }
  }

  // ゲーミフィケーション処理（ログイン時のみ）
  if (userId) {
    const hashtagsRaw2 = formData.get('hashtags') as string
    let hasHashtag = false
    try {
      const tags: string[] = JSON.parse(hashtagsRaw2 ?? '[]')
      hasHashtag = tags.length > 0
    } catch { /* ignore */ }
    await processReviewGamification(userId, hasHashtag)
  }

  redirect(`/reviews/thanks?review_id=${inserted.id}`)
}
