import { redirect } from 'next/navigation'
import { getCompanyUser } from '@/app/lib/companyAuth'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import { RADAR_AXES } from '@/app/lib/radarAxes'
import AnalyticsCharts from './Charts'

export const revalidate = 0

// ──────────────────────────────────────────────
// 型定義
// ──────────────────────────────────────────────
type Review = {
  id: number
  score: number | null
  created_at: string
  user_id: string | null
  product_id: number
  radar_scores: Record<string, number> | null
}

type Profile = {
  id: string
  gender: 'male' | 'female' | 'no_answer' | null
  birthday: string | null
}

const GENDER_LABEL: Record<string, string> = {
  male: '男性',
  female: '女性',
  no_answer: '回答なし',
  unknown: '不明',
}

function getAgeGroup(birthday: string | null): string {
  if (!birthday) return '不明'
  const birth = new Date(birthday)
  const now = new Date()
  const age = now.getFullYear() - birth.getFullYear() -
    (now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate()) ? 1 : 0)
  if (age < 10) return '10歳未満'
  if (age < 20) return '10代'
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  if (age < 50) return '40代'
  if (age < 60) return '50代'
  return '60代以上'
}

const AGE_ORDER = ['10歳未満', '10代', '20代', '30代', '40代', '50代', '60代以上', '不明']

// ──────────────────────────────────────────────
// ページ本体
// ──────────────────────────────────────────────
export default async function CompanyAnalyticsPage() {
  const cu = await getCompanyUser()
  if (!cu) redirect('/company/apply')

  // 自社商品ID取得
  const { data: byId } = await supabaseAdmin.from('products').select('id, name').eq('company_id', cu.company.id)
  const { data: byName } = await supabaseAdmin.from('products').select('id, name').eq('store_name', cu.company.name)

  const seen = new Set<number>()
  const products = [...(byId ?? []), ...(byName ?? [])].filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id); return true
  })
  const productIds = products.map((p) => p.id)
  const productMap = new Map(products.map((p) => [p.id, p.name]))

  if (productIds.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900">分析レポート</h1>
        <div className="bg-white rounded-xl shadow-sm py-20 text-center text-gray-400">
          <p className="text-sm">商品が登録されていません</p>
        </div>
      </div>
    )
  }

  // 口コミ取得（全件、user_id と radar_scores 含む）
  const { data: rawReviews } = await supabaseAdmin
    .from('reviews')
    .select('id, score, created_at, user_id, product_id, radar_scores')
    .in('product_id', productIds)
    .order('created_at', { ascending: true })

  const reviews: Review[] = rawReviews ?? []

  // プロフィール取得（ログインユーザーのみ）
  const userIds = [...new Set(reviews.map((r) => r.user_id).filter((id): id is string => !!id))]
  const { data: rawProfiles } = userIds.length > 0
    ? await supabaseAdmin.from('profiles').select('id, gender, birthday').in('id', userIds)
    : { data: [] }

  const profileMap = new Map<string, Profile>()
  for (const p of rawProfiles ?? []) profileMap.set(p.id, p)

  // ──────────────────────────────────────────────
  // 1. 投稿トレンド（過去60日）
  // ──────────────────────────────────────────────
  const trendDays = 60
  const today = new Date()
  const trendMap = new Map<string, number>()
  for (let i = trendDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    trendMap.set(d.toISOString().slice(0, 10), 0)
  }
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() - trendDays)
  for (const r of reviews) {
    const key = r.created_at.slice(0, 10)
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1)
  }
  const trendData = Array.from(trendMap.entries()).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    count,
  }))

  // ──────────────────────────────────────────────
  // 2. 性別別集計
  // ──────────────────────────────────────────────
  type DemoStats = { scores: number[]; radarSums: Record<string, number>; radarCounts: Record<string, number> }
  const genderStats = new Map<string, DemoStats>()

  function initStats(): DemoStats {
    return { scores: [], radarSums: {}, radarCounts: {} }
  }

  for (const r of reviews) {
    const profile = r.user_id ? profileMap.get(r.user_id) : null
    const gKey = profile?.gender ?? 'unknown'
    if (!genderStats.has(gKey)) genderStats.set(gKey, initStats())
    const s = genderStats.get(gKey)!
    if (r.score != null) s.scores.push(r.score)
    if (r.radar_scores) {
      for (const ax of RADAR_AXES) {
        const val = r.radar_scores[ax.key]
        if (val != null) {
          s.radarSums[ax.key] = (s.radarSums[ax.key] ?? 0) + val
          s.radarCounts[ax.key] = (s.radarCounts[ax.key] ?? 0) + 1
        }
      }
    }
  }

  const genderData = ['male', 'female', 'no_answer', 'unknown']
    .map((key) => {
      const s = genderStats.get(key)
      if (!s || s.scores.length === 0) return null
      return {
        gender: GENDER_LABEL[key] ?? key,
        count: s.scores.length,
        avg: Math.round((s.scores.reduce((a, b) => a + b, 0) / s.scores.length) * 10) / 10,
        radar: RADAR_AXES.map((ax) => ({
          label: ax.label,
          avg: s.radarCounts[ax.key]
            ? Math.round((s.radarSums[ax.key] / s.radarCounts[ax.key]) * 10) / 10
            : null,
        })),
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  // ──────────────────────────────────────────────
  // 3. 年代別集計
  // ──────────────────────────────────────────────
  const ageStats = new Map<string, DemoStats>()

  for (const r of reviews) {
    const profile = r.user_id ? profileMap.get(r.user_id) : null
    const aKey = profile ? getAgeGroup(profile.birthday) : '不明'
    if (!ageStats.has(aKey)) ageStats.set(aKey, initStats())
    const s = ageStats.get(aKey)!
    if (r.score != null) s.scores.push(r.score)
    if (r.radar_scores) {
      for (const ax of RADAR_AXES) {
        const val = r.radar_scores[ax.key]
        if (val != null) {
          s.radarSums[ax.key] = (s.radarSums[ax.key] ?? 0) + val
          s.radarCounts[ax.key] = (s.radarCounts[ax.key] ?? 0) + 1
        }
      }
    }
  }

  const ageData = AGE_ORDER
    .map((key) => {
      const s = ageStats.get(key)
      if (!s || s.scores.length === 0) return null
      return {
        ageGroup: key,
        count: s.scores.length,
        avg: Math.round((s.scores.reduce((a, b) => a + b, 0) / s.scores.length) * 10) / 10,
        radar: RADAR_AXES.map((ax) => ({
          label: ax.label,
          avg: s.radarCounts[ax.key]
            ? Math.round((s.radarSums[ax.key] / s.radarCounts[ax.key]) * 10) / 10
            : null,
        })),
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  // ──────────────────────────────────────────────
  // 4. 商品別口コミ数ランキング
  // ──────────────────────────────────────────────
  const countByProduct = new Map<number, { count: number; scoreSum: number }>()
  for (const r of reviews) {
    const cur = countByProduct.get(r.product_id) ?? { count: 0, scoreSum: 0 }
    cur.count++
    cur.scoreSum += r.score ?? 0
    countByProduct.set(r.product_id, cur)
  }
  const productRanking = [...countByProduct.entries()]
    .map(([id, { count, scoreSum }]) => ({
      name: productMap.get(id) ?? `商品#${id}`,
      count,
      avg: count > 0 ? Math.round((scoreSum / count) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ──────────────────────────────────────────────
  // 5. 全体レーダー平均（全ユーザー）
  // ──────────────────────────────────────────────
  const allRadarSums: Record<string, number> = {}
  const allRadarCounts: Record<string, number> = {}
  for (const r of reviews) {
    if (!r.radar_scores) continue
    for (const ax of RADAR_AXES) {
      const val = r.radar_scores[ax.key]
      if (val != null) {
        allRadarSums[ax.key] = (allRadarSums[ax.key] ?? 0) + val
        allRadarCounts[ax.key] = (allRadarCounts[ax.key] ?? 0) + 1
      }
    }
  }
  const overallRadar = RADAR_AXES.map((ax) => ({
    label: ax.label,
    avg: allRadarCounts[ax.key]
      ? Math.round((allRadarSums[ax.key] / allRadarCounts[ax.key]) * 10) / 10
      : 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">分析レポート</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          全 {reviews.length} 件の口コミ / {products.length} 商品
        </p>
      </div>

      <AnalyticsCharts
        trendData={trendData}
        genderData={genderData}
        ageData={ageData}
        productRanking={productRanking}
        overallRadar={overallRadar}
        radarAxes={RADAR_AXES.map((ax) => ({ key: ax.key, label: ax.label }))}
        totalReviews={reviews.length}
      />
    </div>
  )
}
