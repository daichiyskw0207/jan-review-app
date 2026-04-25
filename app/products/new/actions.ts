'use server'

import { redirect } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { verifyJanCode } from '@/app/lib/janVerify'

export type ProductSubmitState = {
  errors?: {
    name?: string[]
    category?: string[]
  }
  message?: string
}

export async function submitProduct(
  prevState: ProductSubmitState,
  formData: FormData
): Promise<ProductSubmitState> {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const store_name = formData.get('store_name') as string
  const jan_code = formData.get('jan_code') as string
  const price_str = formData.get('price') as string

  const errors: ProductSubmitState['errors'] = {}

  if (!name || name.trim().length === 0) {
    errors.name = ['商品名を入力してください']
  } else if (name.trim().length > 100) {
    errors.name = ['商品名は100文字以内で入力してください']
  }

  if (!category || category.trim().length === 0) {
    errors.category = ['カテゴリを入力してください']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  // JANコードが入力されていれば Open Food Facts で検証
  let status = 'pending'
  if (jan_code && jan_code.trim().length > 0) {
    const result = await verifyJanCode(jan_code.trim())
    if (result.found) {
      status = 'approved'
    }
  }

  const price = price_str ? parseInt(price_str, 10) : null

  const { data: inserted, error } = await supabase
    .from('products')
    .insert({
      name: name.trim(),
      category: category.trim(),
      store_name: store_name?.trim() || null,
      jan_code: jan_code?.trim() || null,
      price: price_str && !isNaN(price as number) ? price : null,
      status,
      submitted_by: 'user',
    })
    .select('id')
    .single()

  if (error || !inserted) {
    return { message: '商品の登録に失敗しました。もう一度お試しください。' }
  }

  // JANコードを product_jan_codes にも登録
  if (jan_code && jan_code.trim().length > 0) {
    await supabase
      .from('product_jan_codes')
      .insert({ product_id: inserted.id, jan_code: jan_code.trim() })
  }

  // store_name が入力されていれば、companies に存在しない場合は自動追加
  if (store_name && store_name.trim().length > 0) {
    const trimmedName = store_name.trim()
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('name', trimmedName)
      .maybeSingle()

    if (!existingCompany) {
      await supabase
        .from('companies')
        .insert({ name: trimmedName })
    }
  }

  if (status === 'approved') {
    redirect(`/products/${inserted.id}?new=1`)
  } else {
    redirect(`/products/pending?submitted=${inserted.id}`)
  }
}
