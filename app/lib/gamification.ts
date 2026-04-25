import { supabase } from './supabase'
import { BADGES, getLevelFromPoints } from './badges'

interface ReviewStats {
  totalReviews: number
  byCategory: Record<string, number>
  distinctCategories: number
  hashtagReviews: number
}

async function getUserReviewStats(userId: string): Promise<ReviewStats> {
  // 全レビュー（カテゴリ取得のためproductsをjoin）
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, products(category)')
    .eq('user_id', userId)

  const reviewList = reviews ?? []
  const totalReviews = reviewList.length

  const byCategory: Record<string, number> = {}
  for (const r of reviewList) {
    const cat = (r.products as unknown as { category: string } | null)?.category
    if (cat) byCategory[cat] = (byCategory[cat] ?? 0) + 1
  }
  const distinctCategories = Object.keys(byCategory).length

  // ハッシュタグ付きレビュー数
  const reviewIds = reviewList.map((r) => r.id)
  let hashtagReviews = 0
  if (reviewIds.length > 0) {
    const { data: rh } = await supabase
      .from('review_hashtags')
      .select('review_id')
      .in('review_id', reviewIds)
    // 重複なしでカウント
    hashtagReviews = new Set((rh ?? []).map((r) => r.review_id)).size
  }

  return { totalReviews, byCategory, distinctCategories, hashtagReviews }
}

async function checkAndAwardBadges(userId: string): Promise<number> {
  // すでに獲得済みのバッジ
  const { data: existing } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)
  const awardedIds = new Set((existing ?? []).map((b) => b.badge_id))

  const stats = await getUserReviewStats(userId)

  const newBadgeIds: string[] = []
  let bonusPoints = 0

  for (const badge of BADGES) {
    if (awardedIds.has(badge.id)) continue

    let earned = false

    if (badge.totalReviews !== undefined) {
      earned = stats.totalReviews >= badge.totalReviews
    } else if (badge.genreCategory !== undefined && badge.genreCount !== undefined) {
      earned = (stats.byCategory[badge.genreCategory] ?? 0) >= badge.genreCount
    } else if (badge.hashtagReviews !== undefined) {
      earned = stats.hashtagReviews >= badge.hashtagReviews
    } else if (badge.distinctCategories !== undefined) {
      earned = stats.distinctCategories >= badge.distinctCategories
    }

    if (earned) {
      newBadgeIds.push(badge.id)
      bonusPoints += badge.pointsReward
    }
  }

  if (newBadgeIds.length > 0) {
    await supabase.from('user_badges').insert(
      newBadgeIds.map((badge_id) => ({ user_id: userId, badge_id }))
    )
  }

  return bonusPoints
}

export async function processReviewGamification(
  userId: string,
  hasHashtag: boolean,
) {
  try {
    // 現在のポイント取得
    const { data: existing } = await supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', userId)
      .maybeSingle()

    const currentPoints = existing?.total_points ?? 0

    // ポイント計算
    const isFirstReview = currentPoints === 0
    let earned = 10                       // 通常ポイント
    if (isFirstReview) earned += 40      // 初回ボーナス
    if (hasHashtag) earned += 5          // ハッシュタグボーナス

    // バッジチェック（ボーナスポイントも含む）
    const badgeBonus = await checkAndAwardBadges(userId)
    const totalEarned = earned + badgeBonus
    const newTotal = currentPoints + totalEarned
    const newLevel = getLevelFromPoints(newTotal).level

    await supabase.from('user_points').upsert({
      user_id: userId,
      total_points: newTotal,
      level: newLevel,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    // ゲーミフィケーション失敗はレビュー投稿を妨げない
    console.error('gamification error:', e)
  }
}
