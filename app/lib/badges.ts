export type BadgeType = 'milestone' | 'genre' | 'special'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  emoji: string
  type: BadgeType
  pointsReward: number
  // 条件
  totalReviews?: number        // 累計投稿数
  genreCategory?: string       // ジャンル名
  genreCount?: number          // そのジャンルの投稿数
  hashtagReviews?: number      // ハッシュタグ付き投稿数
  distinctCategories?: number  // 何カテゴリ以上
}

export const BADGES: BadgeDefinition[] = [
  // ── マイルストーン ──────────────────────────────
  {
    id: 'first_review',
    name: 'はじめの一歩',
    description: '初めての口コミを投稿した',
    emoji: '🌱',
    type: 'milestone',
    totalReviews: 1,
    pointsReward: 30,
  },
  {
    id: 'review_5',
    name: 'コツコツ派',
    description: '累計5件の口コミを投稿した',
    emoji: '✍️',
    type: 'milestone',
    totalReviews: 5,
    pointsReward: 20,
  },
  {
    id: 'review_20',
    name: '口コミ中級者',
    description: '累計20件の口コミを投稿した',
    emoji: '📝',
    type: 'milestone',
    totalReviews: 20,
    pointsReward: 50,
  },
  {
    id: 'review_50',
    name: '口コミ職人',
    description: '累計50件の口コミを投稿した',
    emoji: '🔥',
    type: 'milestone',
    totalReviews: 50,
    pointsReward: 100,
  },
  {
    id: 'review_100',
    name: 'レビューの達人',
    description: '累計100件の口コミを投稿した',
    emoji: '💎',
    type: 'milestone',
    totalReviews: 100,
    pointsReward: 200,
  },
  {
    id: 'review_300',
    name: '口コミのプロ',
    description: '累計300件の口コミを投稿した',
    emoji: '🌟',
    type: 'milestone',
    totalReviews: 300,
    pointsReward: 500,
  },
  {
    id: 'review_500',
    name: 'レジェンドレビュアー',
    description: '累計500件の口コミを投稿した',
    emoji: '👑',
    type: 'milestone',
    totalReviews: 500,
    pointsReward: 1000,
  },

  // ── カップ麺・即席食品 ──────────────────────────
  {
    id: 'ramen_beginner',
    name: 'カップ麺ビギナー',
    description: 'カップ麺・即席食品を5件レビューした',
    emoji: '🍜',
    type: 'genre',
    genreCategory: 'カップ麺・即席食品',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'ramen_hunter',
    name: 'カップ麺ハンター',
    description: 'カップ麺・即席食品を20件レビューした',
    emoji: '🍜',
    type: 'genre',
    genreCategory: 'カップ麺・即席食品',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'ramen_master',
    name: 'カップ麺マイスター',
    description: 'カップ麺・即席食品を50件レビューした',
    emoji: '🍜',
    type: 'genre',
    genreCategory: 'カップ麺・即席食品',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── お菓子・スナック ────────────────────────────
  {
    id: 'snack_explorer',
    name: 'スナック探検家',
    description: 'お菓子・スナックを5件レビューした',
    emoji: '🍫',
    type: 'genre',
    genreCategory: 'お菓子・スナック',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'snack_collector',
    name: 'スナックコレクター',
    description: 'お菓子・スナックを20件レビューした',
    emoji: '🍿',
    type: 'genre',
    genreCategory: 'お菓子・スナック',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'snack_master',
    name: 'スナックマイスター',
    description: 'お菓子・スナックを50件レビューした',
    emoji: '🎯',
    type: 'genre',
    genreCategory: 'お菓子・スナック',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── ドリンク ────────────────────────────────────
  {
    id: 'drink_explorer',
    name: 'ドリンク探検家',
    description: 'ドリンクを5件レビューした',
    emoji: '☕',
    type: 'genre',
    genreCategory: 'ドリンク',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'drink_sommelier',
    name: 'ドリンクソムリエ',
    description: 'ドリンクを20件レビューした',
    emoji: '🥤',
    type: 'genre',
    genreCategory: 'ドリンク',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'drink_master',
    name: 'ドリンクマイスター',
    description: 'ドリンクを50件レビューした',
    emoji: '🧃',
    type: 'genre',
    genreCategory: 'ドリンク',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── コンビニ惣菜 ────────────────────────────────
  {
    id: 'sozai_hunter',
    name: '惣菜ハンター',
    description: 'コンビニ惣菜を5件レビューした',
    emoji: '🍱',
    type: 'genre',
    genreCategory: 'コンビニ惣菜',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'sozai_expert',
    name: '惣菜ツウ',
    description: 'コンビニ惣菜を20件レビューした',
    emoji: '🍱',
    type: 'genre',
    genreCategory: 'コンビニ惣菜',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'sozai_master',
    name: '惣菜マイスター',
    description: 'コンビニ惣菜を50件レビューした',
    emoji: '🥡',
    type: 'genre',
    genreCategory: 'コンビニ惣菜',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── スイーツ・デザート ──────────────────────────
  {
    id: 'sweets_explorer',
    name: 'スイーツ探検家',
    description: 'スイーツ・デザートを5件レビューした',
    emoji: '🍰',
    type: 'genre',
    genreCategory: 'スイーツ・デザート',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'sweets_collector',
    name: 'スイーツコレクター',
    description: 'スイーツ・デザートを20件レビューした',
    emoji: '🎂',
    type: 'genre',
    genreCategory: 'スイーツ・デザート',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'sweets_master',
    name: 'スイーツマイスター',
    description: 'スイーツ・デザートを50件レビューした',
    emoji: '🍮',
    type: 'genre',
    genreCategory: 'スイーツ・デザート',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── チルド食品 ──────────────────────────────────
  {
    id: 'chilled_explorer',
    name: 'チルド探検家',
    description: 'チルド食品を5件レビューした',
    emoji: '🥗',
    type: 'genre',
    genreCategory: 'チルド食品',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'chilled_gourmet',
    name: 'チルドグルメ',
    description: 'チルド食品を20件レビューした',
    emoji: '🥙',
    type: 'genre',
    genreCategory: 'チルド食品',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'chilled_master',
    name: 'チルドマイスター',
    description: 'チルド食品を50件レビューした',
    emoji: '❄️',
    type: 'genre',
    genreCategory: 'チルド食品',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── ホットスナック ──────────────────────────────
  {
    id: 'hot_explorer',
    name: 'ホットスナック探検家',
    description: 'ホットスナックを5件レビューした',
    emoji: '🌭',
    type: 'genre',
    genreCategory: 'ホットスナック',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'hot_hunter',
    name: 'ホットスナックハンター',
    description: 'ホットスナックを20件レビューした',
    emoji: '🌶️',
    type: 'genre',
    genreCategory: 'ホットスナック',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'hot_master',
    name: 'ホットスナックマイスター',
    description: 'ホットスナックを50件レビューした',
    emoji: '🔥',
    type: 'genre',
    genreCategory: 'ホットスナック',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── パン・サンドイッチ ──────────────────────────
  {
    id: 'bread_explorer',
    name: 'パン探検家',
    description: 'パン・サンドイッチを5件レビューした',
    emoji: '🥐',
    type: 'genre',
    genreCategory: 'パン・サンドイッチ',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'bread_hunter',
    name: 'パンハンター',
    description: 'パン・サンドイッチを20件レビューした',
    emoji: '🥖',
    type: 'genre',
    genreCategory: 'パン・サンドイッチ',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'bread_master',
    name: 'パンマイスター',
    description: 'パン・サンドイッチを50件レビューした',
    emoji: '🍞',
    type: 'genre',
    genreCategory: 'パン・サンドイッチ',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── 冷凍食品 ────────────────────────────────────
  {
    id: 'frozen_explorer',
    name: '冷食探検家',
    description: '冷凍食品を5件レビューした',
    emoji: '🧊',
    type: 'genre',
    genreCategory: '冷凍食品',
    genreCount: 5,
    pointsReward: 20,
  },
  {
    id: 'frozen_hunter',
    name: '冷食ハンター',
    description: '冷凍食品を20件レビューした',
    emoji: '🧊',
    type: 'genre',
    genreCategory: '冷凍食品',
    genreCount: 20,
    pointsReward: 50,
  },
  {
    id: 'frozen_master',
    name: '冷食マイスター',
    description: '冷凍食品を50件レビューした',
    emoji: '🌨️',
    type: 'genre',
    genreCategory: '冷凍食品',
    genreCount: 50,
    pointsReward: 150,
  },

  // ── スペシャル ──────────────────────────────────
  {
    id: 'tag_master',
    name: 'タグ職人',
    description: 'ハッシュタグ付き口コミを10件投稿した',
    emoji: '🏷️',
    type: 'special',
    hashtagReviews: 10,
    pointsReward: 50,
  },
  {
    id: 'all_rounder',
    name: 'オールラウンダー',
    description: '5カテゴリ以上でレビューを投稿した',
    emoji: '🌈',
    type: 'special',
    distinctCategories: 5,
    pointsReward: 100,
  },
  {
    id: 'full_explorer',
    name: 'コンビニ全制覇',
    description: '8カテゴリ以上でレビューを投稿した',
    emoji: '🗺️',
    type: 'special',
    distinctCategories: 8,
    pointsReward: 300,
  },
]

// ── レベル定義 ───────────────────────────────────────

export const LEVELS = [
  { level: 1, label: '新参者',         emoji: '🌱', minPoints: 0 },
  { level: 2, label: '口コミ入門',     emoji: '✍️', minPoints: 50 },
  { level: 3, label: 'グルメ見習い',   emoji: '🍴', minPoints: 150 },
  { level: 4, label: 'コンビニ通',     emoji: '⭐', minPoints: 400 },
  { level: 5, label: '口コミ職人',     emoji: '🔥', minPoints: 900 },
  { level: 6, label: 'グルメハンター', emoji: '💫', minPoints: 2000 },
  { level: 7, label: 'レビューマスター', emoji: '🏆', minPoints: 4000 },
  { level: 8, label: 'レジェンド',     emoji: '👑', minPoints: 8000 },
]

export function getLevelFromPoints(points: number) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (points >= lvl.minPoints) current = lvl
    else break
  }
  return current
}

export function getNextLevel(points: number) {
  const current = getLevelFromPoints(points)
  return LEVELS.find((l) => l.level === current.level + 1) ?? null
}
