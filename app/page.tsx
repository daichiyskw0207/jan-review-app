export const revalidate = 0

import Link from 'next/link'

// Fisher-Yates シャッフル
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
import { supabase } from './lib/supabase'
import { createSupabaseServerClient } from './lib/supabase-server'
import AppHeader from './components/AppHeader'
import ImageSearchButton from './components/ImageSearchButton'
import ProductSection from './components/ProductSection'

// プロフィールから好みカテゴリを推定
function inferCategories(profile: {
  birthday?: string | null
  gender?: string | null
  occupation?: string | null
}): string[] {
  const cats = new Set<string>()

  // 年齢
  if (profile.birthday) {
    const age = Math.floor((Date.now() - new Date(profile.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age < 25) { cats.add('お菓子・スナック'); cats.add('ドリンク'); cats.add('カップ麺・即席食品') }
    else if (age < 40) { cats.add('コンビニ惣菜'); cats.add('ドリンク'); cats.add('チルド食品') }
    else if (age < 60) { cats.add('コンビニ惣菜'); cats.add('チルド食品'); cats.add('スイーツ・デザート') }
    else { cats.add('チルド食品'); cats.add('ドリンク'); cats.add('スイーツ・デザート') }
  }

  // 性別
  if (profile.gender === 'female') { cats.add('スイーツ・デザート'); cats.add('チルド食品') }
  else if (profile.gender === 'male') { cats.add('ホットスナック'); cats.add('カップ麺・即席食品') }

  // 職業
  if (profile.occupation === 'student') { cats.add('お菓子・スナック'); cats.add('カップ麺・即席食品') }
  else if (profile.occupation === 'company_employee') { cats.add('コンビニ惣菜'); cats.add('ドリンク') }
  else if (profile.occupation === 'homemaker') { cats.add('スイーツ・デザート'); cats.add('チルド食品') }

  // デフォルト（情報なし）
  if (cats.size === 0) {
    ['お菓子・スナック', 'ドリンク', 'コンビニ惣菜'].forEach(c => cats.add(c))
  }

  return [...cats]
}

export default async function Home() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // ログインユーザー取得
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()

  // プロフィール取得
  let profile: { nickname?: string; birthday?: string | null; gender?: string | null; occupation?: string | null } | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('nickname, birthday, gender, occupation').eq('id', user.id).maybeSingle()
    profile = data
  }

  // パーソナライズ商品
  let recommendedProducts: { id: number; name: string; category: string; store_name?: string | null; jan_code?: string | null; score?: number | null }[] = []
  if (profile) {
    const preferredCategories = inferCategories(profile)
    const { data } = await supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .in('category', preferredCategories)
      .limit(40)
    recommendedProducts = shuffle(data ?? []).slice(0, 8)
  }

  // 並列フェッチ
  const [
    { data: recentReviews },
    { data: highRated },
    { data: lowRated },
    { data: newProducts },
    { data: noReviewProducts },
  ] = await Promise.all([
    // トレンド用：直近7日のレビュー
    supabase
      .from('reviews')
      .select('product_id')
      .gte('created_at', sevenDaysAgo),

    // 高評価
    supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .gt('score', 0)
      .order('score', { ascending: false })
      .limit(30),

    // 酷評
    supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .gt('score', 0)
      .order('score', { ascending: true })
      .limit(30),

    // 新着
    supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(30),

    // 口コミ募集中（スコアなし）
    supabase
      .from('products')
      .select('id, name, category, store_name, jan_code, score')
      .eq('status', 'approved')
      .or('score.is.null,score.eq.0')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  // トレンド：レビュー数が多い商品IDを集計
  const reviewCounts: Record<number, number> = {}
  for (const r of recentReviews ?? []) {
    reviewCounts[r.product_id] = (reviewCounts[r.product_id] || 0) + 1
  }
  const trendingIds = Object.entries(reviewCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => Number(id))

  const DISPLAY_COUNT = 8

  const trendingProducts = trendingIds.length > 0
    ? shuffle((await supabase
        .from('products')
        .select('id, name, category, store_name, jan_code, score')
        .eq('status', 'approved')
        .in('id', trendingIds)).data ?? [])
        .slice(0, DISPLAY_COUNT)
    : []

  const highRatedDisplay = shuffle(highRated ?? []).slice(0, DISPLAY_COUNT)
  const lowRatedDisplay = shuffle(lowRated ?? []).slice(0, DISPLAY_COUNT)
  const newProductsDisplay = shuffle(newProducts ?? []).slice(0, DISPLAY_COUNT)
  const noReviewDisplay = shuffle(noReviewProducts ?? []).slice(0, DISPLAY_COUNT)

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader
        actions={
          <>
            <Link href="/companies" className="text-sm text-gray-700 hover:text-orange-500 px-3 py-1.5 transition-colors font-medium">企業</Link>
            <Link href="/company/apply" className="text-sm text-gray-700 hover:text-orange-500 px-3 py-1.5 transition-colors font-medium">企業登録</Link>
            <Link href="/products/pending" className="text-sm text-gray-700 hover:text-orange-500 px-3 py-1.5 transition-colors font-medium">審査中</Link>
            <Link href="/products/new" className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full transition-colors">商品を追加</Link>
          </>
        }
      />

      {/* 検索バー */}
      <div className="bg-orange-500 py-4">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <form action="/search" method="get" className="flex items-center gap-1.5">
            <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 gap-2 shadow-sm focus-within:ring-2 focus-within:ring-white">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                placeholder="商品名・JANコードで検索"
                className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>
            <button type="submit" className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-4 py-2 rounded-lg text-sm shadow-sm transition-colors">
              検索
            </button>
            <Link
              href="/scan"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
              title="バーコードをスキャン"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9V5.5A1.5 1.5 0 0 1 4.5 4H8"/>
                <path d="M3 15v3.5A1.5 1.5 0 0 0 4.5 20H8"/>
                <path d="M21 9V5.5A1.5 1.5 0 0 0 19.5 4H16"/>
                <path d="M21 15v3.5A1.5 1.5 0 0 1 19.5 20H16"/>
                <line x1="5" y1="8" x2="5" y2="16" strokeWidth={1}/>
                <line x1="7" y1="8" x2="7" y2="16" strokeWidth={2}/>
                <line x1="9" y1="8" x2="9" y2="16" strokeWidth={1}/>
                <line x1="11" y1="8" x2="11" y2="16" strokeWidth={1.5}/>
                <line x1="13" y1="8" x2="13" y2="16" strokeWidth={2.5}/>
                <line x1="15" y1="8" x2="15" y2="16" strokeWidth={1}/>
                <line x1="17" y1="8" x2="17" y2="16" strokeWidth={2}/>
                <line x1="19" y1="8" x2="19" y2="16" strokeWidth={1}/>
              </svg>
            </Link>
            <ImageSearchButton />
          </form>

          {/* カテゴリ・ブランドクイックリンク */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link href="/categories" className="flex-shrink-0 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition-colors">
              📂 カテゴリ
            </Link>
            <Link href="/brands" className="flex-shrink-0 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition-colors">
              🏷️ ブランド
            </Link>
            <span className="text-orange-200 text-xs flex-shrink-0">|</span>
            {[
              { cat: 'お菓子・スナック', emoji: '🍿' },
              { cat: 'ドリンク',         emoji: '🥤' },
              { cat: 'スイーツ・デザート', emoji: '🍰' },
              { cat: 'コンビニ惣菜',     emoji: '🍱' },
              { cat: 'カップ麺・即席食品', emoji: '🍜' },
              { cat: 'アイス',           emoji: '🍦' },
              { cat: 'パン・サンドイッチ', emoji: '🥖' },
            ].map(({ cat, emoji }) => (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat)}`}
                className="flex-shrink-0 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              >
                {emoji} {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* トレンド */}
        <ProductSection
          emoji="🔥"
          title="トレンド"
          description="直近7日間で口コミが集まっている商品"
          products={trendingProducts}
          badge={{ label: 'HOT', color: 'bg-red-500' }}
          emptyMessage="まだトレンドデータがありません"
          href="/discover/trending"
        />

        {/* 高評価 */}
        <ProductSection
          emoji="⭐"
          title="高評価"
          description="みんなに愛されている商品"
          products={highRatedDisplay}
          badge={{ label: 'TOP', color: 'bg-orange-500' }}
          href="/discover/high-rated"
        />

        {/* 酷評 */}
        <ProductSection
          emoji="💀"
          title="酷評"
          description="賛否両論・要注意な商品"
          products={lowRatedDisplay}
          badge={{ label: 'LOW', color: 'bg-gray-500' }}
          href="/discover/low-rated"
        />

        {/* 新着 */}
        <ProductSection
          emoji="🆕"
          title="新着"
          description="最近登録された商品"
          products={newProductsDisplay}
          badge={{ label: 'NEW', color: 'bg-blue-500' }}
          href="/discover/new"
        />

        {/* 口コミ募集中 */}
        <ProductSection
          emoji="✍️"
          title="口コミ募集中"
          description="あなたの一言が最初のレビューになる"
          products={noReviewDisplay}
          emptyMessage="口コミ募集中の商品はありません"
          href="/discover/no-reviews"
        />

        {/* あなたが好きそうな */}
        {user && profile ? (
          <ProductSection
            emoji="💡"
            title={`${profile.nickname ?? 'あなた'}が好きそうな商品`}
            description="プロフィールをもとにおすすめ"
            products={recommendedProducts}
            emptyMessage="おすすめ商品を準備中です"
          />
        ) : (
          <section>
            <div className="flex items-baseline gap-2 mb-3">
              <h2 className="text-base font-bold text-gray-800">
                <span className="mr-1">💡</span>あなたが好きそうな商品
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 text-center text-gray-400 border border-dashed border-gray-200">
              <p className="text-sm">ログインするとあなたの好みに合わせた商品をご提案します</p>
              <Link href="/auth/login" className="inline-block mt-3 text-xs bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full">
                ログインして試す
              </Link>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
