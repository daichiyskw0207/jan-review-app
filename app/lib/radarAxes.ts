// ── 食品カテゴリ用（既存） ─────────────────────────────────
export const RADAR_AXES_FOOD = [
  { key: 'radar_cospa',       label: 'コスパ' },
  { key: 'radar_convenience', label: 'お手軽さ' },
  { key: 'radar_taste',       label: '味・風味' },
  { key: 'radar_volume',      label: 'ボリューム' },
  { key: 'radar_repeat',      label: 'リピートしたい度' },
  { key: 'radar_recommend',   label: 'おすすめ度' },
] as const

// ── 家電カテゴリ用 ─────────────────────────────────────────
export const RADAR_AXES_APPLIANCE = [
  { key: 'radar_cospa',       label: 'コスパ' },
  { key: 'radar_usability',   label: '使いやすさ' },
  { key: 'radar_performance', label: '機能・性能' },
  { key: 'radar_design',      label: 'デザイン' },
  { key: 'radar_repeat',      label: 'また買いたい度' },
  { key: 'radar_recommend',   label: 'おすすめ度' },
] as const

// ── 家具・インテリアカテゴリ用 ────────────────────────────
export const RADAR_AXES_FURNITURE = [
  { key: 'radar_cospa',    label: 'コスパ' },
  { key: 'radar_quality',  label: '品質・耐久性' },
  { key: 'radar_design',   label: 'デザイン' },
  { key: 'radar_assembly', label: '組み立てやすさ' },
  { key: 'radar_repeat',   label: 'また買いたい度' },
  { key: 'radar_recommend', label: 'おすすめ度' },
] as const

// 後方互換性のためデフォルトエクスポートは食品用
export const RADAR_AXES = RADAR_AXES_FOOD

export type RadarAxis = { key: string; label: string }

// ── カテゴリ分類 ──────────────────────────────────────────
export const APPLIANCE_CATEGORIES = new Set([
  'スマートフォン・タブレット',
  'パソコン・周辺機器',
  'テレビ・映像機器',
  '生活家電',
  '調理家電',
  'カメラ・オーディオ',
])

export const FURNITURE_CATEGORIES = new Set([
  'ソファ・チェア',
  'テーブル・デスク',
  '収納・棚',
  'ベッド・寝具',
  'インテリア・雑貨',
])

/** カテゴリ名から対応するレーダー軸を返す */
export function getRadarAxes(category?: string | null): readonly RadarAxis[] {
  if (!category) return RADAR_AXES_FOOD
  if (APPLIANCE_CATEGORIES.has(category)) return RADAR_AXES_APPLIANCE
  if (FURNITURE_CATEGORIES.has(category)) return RADAR_AXES_FURNITURE
  return RADAR_AXES_FOOD
}

export type RadarAxisKey = typeof RADAR_AXES_FOOD[number]['key']
