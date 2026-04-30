import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import ReviewForm from './ReviewForm'
import AppHeader from '@/app/components/AppHeader'
import { getAgeRestriction, checkAgeForPost } from '@/app/lib/ageRestrictions'

export const revalidate = 0

interface Props {
  searchParams: Promise<{ product_id?: string }>
}

export default async function NewReviewPage({ searchParams }: Props) {
  const { product_id } = await searchParams

  let product: { id: string; name: string; store_name?: string; category?: string } | null = null
  if (product_id) {
    const { data } = await supabase
      .from('products')
      .select('id, name, store_name, category, min_age')
      .eq('id', product_id)
      .single()
    product = data
  }

  const backHref = product_id ? `/products/${product_id}` : '/'

  // ── ログインチェック（未ログインは投稿不可） ──
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppHeader backHref={backHref} />
        <main className="max-w-2xl mx-auto px-4 py-6">
          {product && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">画像</div>
              <div className="flex-1 min-w-0">
                {product.category && <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{product.category}</span>}
                <p className="font-medium text-gray-900 mt-0.5 truncate">{product.name}</p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">✍️</div>
            <h2 className="text-base font-bold text-gray-900 mb-2">口コミの投稿は会員限定です</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              無料会員登録をすると口コミの閲覧・投稿ができるようになります。
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-8 py-3 rounded-xl transition-colors"
            >
              無料で登録・ログイン
            </Link>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link href={backHref} className="text-sm text-orange-500 hover:underline">← 商品ページに戻る</Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── 年齢制限チェック ──────────────────────────
  const ageRestriction = getAgeRestriction(product?.category, (product as {min_age?: number | null} | null)?.min_age)
  let ageBlock: React.ReactNode = null

  if (ageRestriction) {
    // ログインユーザーの生年月日を取得
    let birthday: string | null | undefined = null
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('birthday')
        .eq('id', user.id)
        .maybeSingle()
      birthday = profile?.birthday
    }

    const check = checkAgeForPost(ageRestriction, birthday, !!user)

    if (!check.allowed) {
      const msgMap = {
        not_logged_in: {
          icon: '🔒',
          title: `${ageRestriction.minAge}歳以上対象の商品です`,
          body: `【${ageRestriction.categoryLabel}】への口コミ投稿には、年齢確認のためログインが必要です。`,
          action: (
            <Link
              href="/auth/login"
              className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              ログインする
            </Link>
          ),
        },
        no_birthday: {
          icon: '📅',
          title: '生年月日が未登録です',
          body: `【${ageRestriction.categoryLabel}】への口コミ投稿には生年月日の登録が必要です。プロフィール設定から生年月日を登録してください。`,
          action: (
            <Link
              href="/profile/setup"
              className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              プロフィールを設定する
            </Link>
          ),
        },
        too_young: {
          icon: '🔞',
          title: '年齢条件を満たしていません',
          body: `【${ageRestriction.categoryLabel}】は${ageRestriction.minAge}歳以上を対象としています。年齢条件を満たしていないため、この商品への口コミを投稿できません。`,
          action: null,
        },
      } as const

      const msg = msgMap[check.reason]

      ageBlock = (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">{msg.icon}</div>
          <h2 className="text-base font-bold text-gray-900 mb-2">{msg.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{msg.body}</p>
          {msg.action}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <Link href={backHref} className="text-sm text-orange-500 hover:underline">
              ← 商品ページに戻る
            </Link>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <AppHeader backHref={backHref} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* ページタイトル */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">口コミを投稿</h2>
        </div>

        {/* 商品情報カード */}
        {product ? (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
              画像
            </div>
            <div className="flex-1 min-w-0">
              {product.category && (
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              )}
              {product.store_name && (
                <p className="text-xs text-gray-500 mt-1">{product.store_name}</p>
              )}
              <p className="font-medium text-gray-900 mt-0.5 truncate">{product.name}</p>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-orange-600">
              商品ページの「口コミを書く」ボタンから投稿すると、商品が自動入力されます。
            </p>
          </div>
        )}

        {/* 年齢制限ブロック or フォーム */}
        {ageBlock ? (
          ageBlock
        ) : (
          <>
            {/* フォームカード */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <ReviewForm productId={product_id ?? ''} category={product?.category ?? ''} />
            </div>

            {/* ガイドライン */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">投稿ガイドライン</h3>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>実際に購入・利用した商品の口コミをお寄せください</li>
                <li>他ユーザーへの誹謗中傷、不適切なコンテンツは禁止です</li>
                <li>個人情報の記載はお控えください</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
