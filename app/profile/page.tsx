import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import { supabase } from '@/app/lib/supabase'
import AppHeader from '@/app/components/AppHeader'
import { BADGES, LEVELS, getLevelFromPoints, getNextLevel } from '@/app/lib/badges'
import NewsletterToggle from './NewsletterToggle'

export const revalidate = 0

export default async function ProfilePage() {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) redirect('/auth/login')

  // プロフィール
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, birthday, gender, prefecture, occupation, newsletter_consent')
    .eq('id', user.id)
    .maybeSingle()

  // ポイント・レベル
  const { data: pointsData } = await supabase
    .from('user_points')
    .select('total_points, level')
    .eq('user_id', user.id)
    .maybeSingle()

  const totalPoints = pointsData?.total_points ?? 0
  const currentLevel = getLevelFromPoints(totalPoints)
  const nextLevel = getNextLevel(totalPoints)

  // 獲得バッジ
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id, acquired_at')
    .eq('user_id', user.id)
  const awardedMap = new Map(
    (userBadges ?? []).map((b) => [b.badge_id, b.acquired_at as string])
  )

  // レビュー数
  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // レベルプログレス計算
  const progressPercent = nextLevel
    ? Math.round(((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100)
    : 100

  const milestones = BADGES.filter((b) => b.type === 'milestone')
  const genreBadges = BADGES.filter((b) => b.type === 'genre')
  const specials = BADGES.filter((b) => b.type === 'special')

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ユーザーカード */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-3xl">
              {currentLevel.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {profile?.nickname ?? 'ゲスト'}
                </h1>
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                  Lv.{currentLevel.level}
                </span>
              </div>
              <p className="text-sm text-orange-500 font-medium mt-0.5">{currentLevel.emoji} {currentLevel.label}</p>
              <p className="text-xs text-gray-400 mt-1">累計口コミ {reviewCount ?? 0}件</p>
            </div>
          </div>

          {/* ポイント＆プログレスバー */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">
                {totalPoints.toLocaleString()} pt
              </span>
              {nextLevel ? (
                <span className="text-xs text-gray-400">
                  次のレベルまで {(nextLevel.minPoints - totalPoints).toLocaleString()} pt
                </span>
              ) : (
                <span className="text-xs text-orange-500 font-bold">MAX レベル達成！</span>
              )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {nextLevel && (
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{currentLevel.emoji} Lv.{currentLevel.level}</span>
                <span>Lv.{nextLevel.level} {nextLevel.emoji} {nextLevel.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* メルマガ設定 */}
        <NewsletterToggle initialConsent={profile?.newsletter_consent ?? false} />

        {/* バッジ一覧 */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            バッジコレクション
            <span className="ml-2 text-orange-500 normal-case font-bold">
              {awardedMap.size} / {BADGES.length}
            </span>
          </h2>

          {/* マイルストーン */}
          <BadgeSection title="🏅 マイルストーン" badges={milestones} awardedMap={awardedMap} />

          {/* ジャンル */}
          <BadgeSection title="🎖️ ジャンル別" badges={genreBadges} awardedMap={awardedMap} />

          {/* スペシャル */}
          <BadgeSection title="✨ スペシャル" badges={specials} awardedMap={awardedMap} />
        </div>

      </main>
    </div>
  )
}

function BadgeSection({
  title,
  badges,
  awardedMap,
}: {
  title: string
  badges: typeof BADGES
  awardedMap: Map<string, string>
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {badges.map((badge) => {
          const acquiredAt = awardedMap.get(badge.id)
          const acquired = !!acquiredAt
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                acquired
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-gray-50 border-gray-100 opacity-40'
              }`}
            >
              <span className="text-3xl mb-1.5">{badge.emoji}</span>
              <p className={`text-xs font-bold leading-tight ${acquired ? 'text-gray-800' : 'text-gray-500'}`}>
                {badge.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight hidden sm:block">
                {badge.description}
              </p>
              {acquired && (
                <p className="text-xs text-orange-400 mt-1 font-medium">
                  {new Date(acquiredAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </p>
              )}
              {!acquired && (
                <p className="text-xs text-gray-300 mt-1">🔒</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
