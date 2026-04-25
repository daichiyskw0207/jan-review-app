'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import { getCompanyUser } from '@/app/lib/companyAuth'

// 商品画像のアップロード
export async function uploadProductImage(formData: FormData): Promise<{ error?: string; url?: string }> {
  const cu = await getCompanyUser()
  if (!cu) return { error: '権限がありません' }

  const productId = formData.get('product_id') as string
  const file = formData.get('image') as File
  if (!file || file.size === 0) return { error: 'ファイルを選択してください' }
  if (file.size > 5 * 1024 * 1024) return { error: 'ファイルサイズは5MB以下にしてください' }

  // 自社商品かチェック
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, company_id, store_name')
    .eq('id', productId)
    .maybeSingle()

  const isOwn = product?.company_id === cu.company.id || product?.store_name === cu.company.name
  if (!isOwn) return { error: '自社商品ではありません' }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `products/${productId}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('product-images')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: '画像のアップロードに失敗しました' }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('product-images')
    .getPublicUrl(path)

  await supabaseAdmin
    .from('products')
    .update({ image_url: publicUrl })
    .eq('id', productId)

  revalidatePath('/company/products')
  return { url: publicUrl }
}

// CSV一括インポート（JANコード + 商品名）
export async function importProductsCsv(formData: FormData): Promise<{ error?: string; imported?: number }> {
  const cu = await getCompanyUser()
  if (!cu) return { error: '権限がありません' }

  const file = formData.get('csv') as File
  if (!file || file.size === 0) return { error: 'CSVファイルを選択してください' }

  const text = await file.text()
  const lines = text.split('\n').filter((l) => l.trim())
  // ヘッダー行をスキップ
  const rows = lines.slice(1).map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')))

  let imported = 0
  for (const row of rows) {
    const [jan_code, name, category] = row
    if (!jan_code || !name) continue

    // 既存チェック
    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('jan_code', jan_code)
      .maybeSingle()

    if (!existing) {
      await supabaseAdmin.from('products').insert({
        jan_code,
        name,
        category: category ?? 'その他',
        company_id: cu.company.id,
        store_name: cu.company.name,
        status: 'approved',
      })
      imported++
    }
  }

  revalidatePath('/company/products')
  return { imported }
}
