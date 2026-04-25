export const RADAR_AXES = [
  { key: 'radar_cospa',       label: 'コスパ' },
  { key: 'radar_convenience', label: 'お手軽さ' },
  { key: 'radar_taste',       label: '味・風味' },
  { key: 'radar_volume',      label: 'ボリューム' },
  { key: 'radar_repeat',      label: 'リピートしたい度' },
  { key: 'radar_recommend',   label: 'おすすめ度' },
] as const

export type RadarAxisKey = typeof RADAR_AXES[number]['key']
