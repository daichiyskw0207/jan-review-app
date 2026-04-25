import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const jan = req.nextUrl.searchParams.get('jan')
  if (!jan || !jan.trim()) {
    return NextResponse.json({ found: false }, { status: 400 })
  }

  const janCode = jan.trim()

  // 自前DBのproduct_jan_codesから検索
  const { data: janRow } = await supabase
    .from('product_jan_codes')
    .select('product_id')
    .eq('jan_code', janCode)
    .maybeSingle()

  if (janRow?.product_id) {
    // 商品情報を取得
    const { data: product } = await supabase
      .from('products')
      .select('id, name, category, sub_category, store_name, price')
      .eq('id', janRow.product_id)
      .maybeSingle()

    if (product) {
      return NextResponse.json({
        found: true,
        existsInDb: true,
        productId: product.id,
        name: product.name,
        category: product.category,
        subCategory: product.sub_category,
        brand: product.store_name,
        price: product.price,
      })
    }
  }

  // products.jan_codeカラム（旧形式）でも検索
  const { data: productDirect } = await supabase
    .from('products')
    .select('id, name, category, sub_category, store_name, price')
    .eq('jan_code', janCode)
    .maybeSingle()

  if (productDirect) {
    return NextResponse.json({
      found: true,
      existsInDb: true,
      productId: productDirect.id,
      name: productDirect.name,
      category: productDirect.category,
      subCategory: productDirect.sub_category,
      brand: productDirect.store_name,
      price: productDirect.price,
    })
  }

  // DBに存在しない場合
  return NextResponse.json({ found: false })
}
