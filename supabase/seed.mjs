// 実行方法:
//   node --env-file=.env.local supabase/seed.mjs

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// service_role キーは RLS をバイパスして INSERT できます
// Supabase ダッシュボード → Project Settings → API → service_role (secret) でコピー
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が見つかりません。.env.local を確認してください。')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY が未設定です。RLS が有効な場合は失敗します。')
  console.warn('   .env.local に SUPABASE_SERVICE_ROLE_KEY=<service_role キー> を追加してください。')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const products = [
  // ホットスナック
  { name: '肉まん',                       category: 'ホットスナック', store_name: 'セブンイレブン',  jan_code: '4901301311234', score: 4.3, price: 160 },
  { name: 'アメリカンドッグ',             category: 'ホットスナック', store_name: 'ローソン',         jan_code: '4901301322345', score: 3.8, price: 130 },
  { name: 'フランクフルト',               category: 'ホットスナック', store_name: 'ファミリーマート',  jan_code: '4901301333456', score: 3.6, price: 120 },

  // お菓子
  { name: 'ポテトチップス うすしお味',   category: 'お菓子',         store_name: 'カルビー',         jan_code: '4901340198765', score: 4.5, price: 160 },
  { name: 'じゃがりこ サラダ',           category: 'お菓子',         store_name: 'カルビー',         jan_code: '4901340209876', score: 4.4, price: 130 },
  { name: 'チョコレートパイ',             category: 'お菓子',         store_name: '森永製菓',         jan_code: '4902888221234', score: 4.1, price: 168 },
  { name: 'コアラのマーチ',               category: 'お菓子',         store_name: 'ロッテ',           jan_code: '4903333012345', score: 4.2, price: 155 },
  { name: 'ハッピーターン',               category: 'お菓子',         store_name: '亀田製菓',         jan_code: '4901313023456', score: 4.6, price: 198 },

  // 飲料
  { name: '綾鷹 緑茶 500ml',             category: '飲料',           store_name: '伊藤園',           jan_code: '4902102034567', score: 4.0, price: 160 },
  { name: 'モンスターエナジー',           category: '飲料',           store_name: 'アサヒ飲料',        jan_code: '4549741645678', score: 3.7, price: 220 },
  { name: 'カフェラテ 185g缶',           category: '飲料',           store_name: 'コカ・コーラ',      jan_code: '4902102056789', score: 4.2, price: 118 },

  // パン
  { name: 'ランチパック ピーナッツ',     category: 'パン',           store_name: 'ヤマザキ',          jan_code: '4903110067890', score: 4.3, price: 151 },
  { name: 'クリームパン',                 category: 'パン',           store_name: 'フジパン',          jan_code: '4902130078901', score: 3.9, price: 120 },
  { name: 'コッペパン あんバター',       category: 'パン',           store_name: 'セブンイレブン',   jan_code: null,            score: 4.1, price: 198 },

  // 冷凍食品
  { name: '冷凍餃子 12個入り',           category: '冷凍食品',       store_name: '味の素',            jan_code: '4901001089012', score: 4.7, price: 268 },
  { name: '冷凍チャーハン',               category: '冷凍食品',       store_name: 'ニッスイ',          jan_code: '4902001090123', score: 4.0, price: 298 },
  { name: '冷凍から揚げ',                 category: '冷凍食品',       store_name: '日清食品',          jan_code: '4902201101234', score: 4.3, price: 298 },

  // アイス
  { name: 'ガリガリ君 ソーダ',           category: 'アイス',         store_name: '赤城乳業',          jan_code: '4901818112345', score: 4.5, price:  80 },
  { name: 'パルム チョコレート',         category: 'アイス',         store_name: '森永乳業',          jan_code: '4903065123456', score: 4.4, price: 150 },
  { name: 'MOW バニラ',                  category: 'アイス',         store_name: '森永乳業',          jan_code: '4903065134567', score: 4.3, price: 130 },

  // インスタント
  { name: 'カップヌードル シーフード',   category: 'インスタント',   store_name: '日清食品',          jan_code: '4902105145678', score: 4.2, price: 264 },
  { name: '赤いきつねうどん',             category: 'インスタント',   store_name: '東洋水産',          jan_code: '4901990156789', score: 4.1, price: 220 },
  { name: 'サッポロ一番 塩らーめん',     category: 'インスタント',   store_name: 'サンヨー食品',      jan_code: '4901734167890', score: 4.0, price: 198 },

  // 日用品
  { name: 'パンテーン シャンプー 400ml', category: '日用品',         store_name: 'P&G',               jan_code: '4902430178901', score: 4.0, price: 698 },
  { name: 'ニベアクリーム 169g',         category: '日用品',         store_name: 'ニベア花王',         jan_code: '4901301189012', score: 4.4, price: 598 },
  { name: 'メラミンスポンジ 10個入り',   category: '日用品',         store_name: 'レック',            jan_code: '4903320190123', score: 4.2, price: 498 },
]

// ── 新規商品を挿入 ────────────────────────────────────────────
const { data: existing } = await supabase.from('products').select('name')
const existingNames = new Set((existing ?? []).map((p) => p.name))
const now = new Date().toISOString()
const toInsert = products
  .filter((p) => !existingNames.has(p.name))
  .map((p) => ({ ...p, created_at: now }))

if (toInsert.length > 0) {
  console.log(`📦 ${toInsert.length} 件を新規登録します...`)
  const { error } = await supabase.from('products').insert(toInsert)
  if (error) { console.error('❌ INSERT 失敗:', error.message); process.exit(1) }
  console.log(`✅ ${toInsert.length} 件を登録しました。`)
} else {
  console.log('✅ 新規登録する商品はありません。')
}

// ── 既存商品の price を UPDATE ────────────────────────────────
const priceMap = Object.fromEntries(products.map((p) => [p.name, p.price]))
const toUpdate = (existing ?? []).filter((p) => p.name in priceMap)

if (toUpdate.length > 0) {
  console.log(`💰 ${toUpdate.length} 件の価格を更新します...`)
  let failed = 0
  for (const p of toUpdate) {
    const { error } = await supabase
      .from('products')
      .update({ price: priceMap[p.name] })
      .eq('name', p.name)
    if (error) { console.error(`  ❌ ${p.name}:`, error.message); failed++ }
  }
  if (failed === 0) console.log(`✅ ${toUpdate.length} 件の価格を更新しました。`)
  else console.warn(`⚠️  ${failed} 件の更新に失敗しました。`)
}
