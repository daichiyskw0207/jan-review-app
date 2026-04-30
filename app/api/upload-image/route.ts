import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/app/lib/cloudinary'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // ログイン確認
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('image') as File
  const productId = formData.get('product_id') as string

  if (!file || file.size === 0) {
    return NextResponse.json({ error: '画像ファイルを選択してください' }, { status: 400 })
  }
  if (!productId) {
    return NextResponse.json({ error: 'product_id が必要です' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: '画像ファイルのみアップロード可能です' }, { status: 400 })
  }

  // 商品が存在するか確認
  const { data: product } = await adminSupabase
    .from('products')
    .select('id, image_url, status')
    .eq('id', productId)
    .maybeSingle()

  if (!product) {
    return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
  }

  // 一般ユーザーは画像がない商品のみ登録可能
  if (product.image_url) {
    // 企業・管理者以外は上書き不可（企業は別ルートで行う）
    return NextResponse.json({ error: 'この商品にはすでに画像が登録されています' }, { status: 403 })
  }

  // Cloudinaryにアップロード
  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'rocomee/products',
        public_id: `product_${productId}`,
        overwrite: true,
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // 最大800x800にリサイズ
          { quality: 'auto', fetch_format: 'auto' },  // WebP自動変換・品質最適化
        ],
      },
      (error, result) => {
        if (error || !result) reject(error)
        else resolve(result as { secure_url: string })
      }
    ).end(buffer)
  })

  // DBのimage_urlを更新
  await adminSupabase
    .from('products')
    .update({ image_url: uploadResult.secure_url })
    .eq('id', productId)

  return NextResponse.json({ url: uploadResult.secure_url })
}
