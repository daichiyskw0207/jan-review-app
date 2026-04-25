import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jynrsffbmabitqdxvqci.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bnJzZmZibWFiaXRxZHh2cWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTk5NzAwNCwiZXhwIjoyMDkxNTczMDA0fQ.De-I7oPXQPfkQOPVdBmK-wBNvIfOLO8ouya-kZ94lwc'
)

// 1. 既存の companies を取得
const { data: existing } = await supabase.from('companies').select('name')
const existingNames = new Set((existing ?? []).map(c => c.name))
console.log(`既存企業数: ${existingNames.size}`)

// 2. products の store_name を全取得（ユニーク）
const { data: products } = await supabase
  .from('products')
  .select('store_name')
  .not('store_name', 'is', null)

const storeNames = [...new Set((products ?? []).map(p => p.store_name).filter(Boolean))]
console.log(`商品のstore_name ユニーク数: ${storeNames.length}`)

// 3. まだ companies にない store_name を追加
const toInsert = storeNames
  .filter(name => !existingNames.has(name))
  .map(name => ({ name }))

console.log(`追加対象: ${toInsert.length}社`)
if (toInsert.length > 0) {
  console.log(toInsert.map(c => c.name).join(', '))

  const { data, error } = await supabase
    .from('companies')
    .insert(toInsert)
    .select('name')

  if (error) {
    console.error('エラー:', error.message)
  } else {
    console.log(`✅ ${data.length}社を追加しました`)
  }
} else {
  console.log('追加対象なし')
}
