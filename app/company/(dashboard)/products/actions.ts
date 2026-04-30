'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/app/lib/supabase-admin'
import { getCompanyUser } from '@/app/lib/companyAuth'
import cloudinary from '@/app/lib/cloudinary'

// 商品画像のアップロード（Cloudinary）
export async function uploadProductImage(formData: FormData): Promise<{ error?: string; url?: string }> {
  const cu = await getCompanyUser()
  if (!cu) return { error: '権限がありません' }

  const productId = formData.get('product_id') as string
  const file = formData.get('image') as File
  if (!file || file.size === 0) return { error: 'ファイルを選択してください' }
  if (file.size > 5 * 1024 * 1024) return { error: 'ファイルサイズは5MB以下にしてください' }
  if (!file.type.startsWith('image/')) return { error: '画像ファイルのみアップロード可能です' }

  // 自社商品かチェック
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, company_id, store_name')
    .eq('id', productId)
    .maybeSingle()

  const isOwn = product?.company_id === cu.company.id || product?.store_name === cu.company.name
  if (!isOwn) return { error: '自社商品ではありません' }

  // Cloudinaryにアップロード
  const buffer = Buffer.from(await file.arrayBuffer())
  let uploadResult: { secure_url: string }
  try {
    uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'rocomee/products',
          public_id: `product_${productId}`,
          overwrite: true,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) reject(error)
          else resolve(result as { secure_url: string })
        }
      ).end(buffer)
    })
  } catch {
    return { error: '画像のアップロードに失敗しました' }
  }

  await supabaseAdmin
    .from('products')
    .update({ image_url: uploadResult.secure_url })
    .eq('id', productId)

  revalidatePath('/company/products')
  return { url: uploadResult.secure_url }
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
