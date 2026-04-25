/**
 * Open Food Facts から日本の食品データをインポートするスクリプト
 * 実行: node supabase/import-open-food-facts.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local を読み込む（Windows の CRLF にも対応）
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local')
  const content = readFileSync(envPath, 'utf-8')
  const env = {}
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    env[key] = value
  }
  return env
}

const env = loadEnv()
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Open Food Facts カテゴリ → アプリのカテゴリ マッピング
const CATEGORY_MAP = [
  {
    tags: ['en:beverages', 'en:sodas', 'en:teas', 'en:coffees', 'en:juices',
           'en:waters', 'en:energy-drinks', 'en:plant-based-beverages', 'en:soft-drinks'],
    cat: 'ドリンク',
  },
  {
    tags: ['en:snacks', 'en:sweet-snacks', 'en:chips-and-fries', 'en:crackers',
           'en:biscuits-and-cakes', 'en:popcorn', 'en:rice-crackers'],
    cat: 'お菓子・スナック',
  },
  {
    tags: ['en:chocolates', 'en:candies', 'en:gummies', 'en:desserts',
           'en:cakes', 'en:pastries', 'en:ice-creams', 'en:frozen-desserts'],
    cat: 'スイーツ・デザート',
  },
  {
    tags: ['en:ice-creams', 'en:ice-cream', 'en:ice-lollies'],
    cat: 'アイス',
  },
  {
    tags: ['en:breads', 'en:sandwiches', 'en:rolls'],
    cat: 'パン・サンドイッチ',
  },
  {
    tags: ['en:instant-noodles', 'en:instant-soups', 'en:instant-meals', 'en:cup-noodles'],
    cat: 'カップ麺・即席食品',
  },
  {
    tags: ['en:frozen-foods', 'en:frozen-meals', 'en:chilled-foods', 'en:prepared-meals'],
    cat: 'チルド食品',
  },
  {
    tags: ['en:ready-to-eat', 'en:convenience-foods', 'en:hot-dogs', 'en:rice-balls'],
    cat: 'コンビニ惣菜',
  },
]

function mapCategory(categoryTags) {
  if (!Array.isArray(categoryTags) || categoryTags.length === 0) return 'その他'
  // アイスを先に判定（スナックより優先）
  if (categoryTags.some(t => ['en:ice-creams', 'en:ice-cream', 'en:ice-lollies'].includes(t))) {
    return 'アイス'
  }
  for (const { tags, cat } of CATEGORY_MAP) {
    if (tags.some(t => categoryTags.includes(t))) return cat
  }
  return 'その他'
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchPage(page) {
  const url = new URL('https://world.openfoodfacts.org/api/v2/search')
  url.searchParams.set('countries_tags_en', 'japan')
  url.searchParams.set('page_size', '200')
  url.searchParams.set('page', String(page))
  url.searchParams.set('fields', 'code,product_name_ja,product_name,brands,categories_tags_en')
  url.searchParams.set('json', '1')

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'JAN-Kuchikomi-App - Educational Project' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// チュートリアル用に確実に必要な商品
const TUTORIAL_PRODUCTS = [
  { name: 'コカ・コーラ 500ml',        category: 'ドリンク',       store_name: 'コカ・コーラ', jan_code: '4902102072541' },
  { name: 'じゃがりこ サラダ',          category: 'お菓子・スナック', store_name: 'カルビー',     jan_code: '4901340209876' },
  { name: 'ポテトチップス うすしお味',   category: 'お菓子・スナック', store_name: 'カルビー',     jan_code: '4901340198765' },
  { name: '爽健美茶 600ml',             category: 'ドリンク',       store_name: 'コカ・コーラ', jan_code: '4902102112637' },
  { name: 'サランラップ 30cm×50m',      category: 'その他',         store_name: '旭化成',       jan_code: '4901670112233' },
]

async function main() {
  console.log('=== Open Food Facts インポーター ===\n')

  // --- Step 1: 既存データを削除 ---
  console.log('【Step 1】既存商品データを削除中...')
  // reviewsが先にあればcascadeされるが、念のためreviewsを先に削除
  const { error: reviewDeleteError } = await supabase
    .from('reviews')
    .delete()
    .gte('id', 0)
  if (reviewDeleteError && reviewDeleteError.code !== '42P01') {
    console.warn('  レビュー削除の警告:', reviewDeleteError.message)
  }

  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .gte('id', 0)
  if (deleteError) {
    console.error('商品削除エラー:', deleteError)
    process.exit(1)
  }
  console.log('  ✓ 削除完了\n')

  // --- Step 2: Open Food Facts からフェッチ ---
  console.log('【Step 2】Open Food Facts から日本の商品を取得中...')
  const products = []
  const seenJan = new Set()
  let page = 1
  const MAX_PAGES = 25 // 最大 5,000 件

  while (page <= MAX_PAGES) {
    try {
      console.log(`  ページ ${page}/${MAX_PAGES} を取得中...`)
      const data = await fetchPage(page)

      if (!data.products || data.products.length === 0) {
        console.log('  → これ以上データなし')
        break
      }

      for (const p of data.products) {
        const name = (p.product_name_ja || p.product_name || '').trim()
        const janCode = (p.code || '').trim()

        // バリデーション
        if (!name || name.length < 2) continue
        if (!janCode || !/^\d{8,13}$/.test(janCode)) continue
        if (seenJan.has(janCode)) continue // 重複排除

        seenJan.add(janCode)
        products.push({
          name: name.slice(0, 100),
          category: mapCategory(p.categories_tags_en),
          store_name: p.brands ? p.brands.split(',')[0].trim().slice(0, 50) : null,
          jan_code: janCode,
          score: 0,
          created_at: new Date().toISOString(),
        })
      }

      console.log(`  → 有効: ${products.length} 件（累計）`)

      if (data.products.length < 200) break // 最終ページ
      page++
      await sleep(800) // レートリミット対策
    } catch (err) {
      console.error(`  ページ ${page} でエラー:`, err.message)
      await sleep(3000)
      page++
    }
  }

  console.log(`\n  合計 ${products.length} 件の有効商品を取得しました\n`)

  // --- Step 3: Supabase に挿入 ---
  console.log('【Step 3】Supabase に挿入中...')
  const BATCH = 100
  let inserted = 0

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH)
    const { error } = await supabase.from('products').insert(batch)
    if (error) {
      console.error(`  バッチ ${Math.floor(i / BATCH) + 1} エラー:`, error.message)
    } else {
      inserted += batch.length
      process.stdout.write(`\r  ${inserted}/${products.length} 件挿入済み...`)
    }
  }
  console.log('\n  ✓ 挿入完了\n')

  // --- Step 4: チュートリアル商品を確認・補完 ---
  console.log('【Step 4】チュートリアル用商品を確認中...')
  for (const p of TUTORIAL_PRODUCTS) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('jan_code', p.jan_code)
      .maybeSingle()

    if (!existing) {
      const { error } = await supabase.from('products').insert({ ...p, score: 0, created_at: new Date().toISOString() })
      if (error) console.error(`  ✗ ${p.name}:`, error.message)
      else        console.log(`  ✓ ${p.name} を追加`)
    } else {
      console.log(`  → ${p.name} は既に存在`)
    }
  }

  console.log('\n🎉 インポート完了!')
  console.log(`   商品数: ${inserted + TUTORIAL_PRODUCTS.length} 件程度`)
}

main().catch(err => {
  console.error('予期しないエラー:', err)
  process.exit(1)
})
