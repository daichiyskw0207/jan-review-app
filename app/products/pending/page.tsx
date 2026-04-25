export const revalidate = 0

import Link from 'next/link'
import { cookies } from 'next/headers'
import { supabase } from '@/app/lib/supabase'
import VoteButton from './VoteButton'
import AppHeader from '@/app/components/AppHeader'

interface Props {
  searchParams: Promise<{ submitted?: string }>
}

export default async function PendingProductsPage({ searchParams }: Props) {
  const { submitted } = await searchParams
  const cookieStore = await cookies()
  const voterToken = cookieStore.get('voter_token')?.value ?? ''

  // 審査待ち商品を取得
  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, store_name, jan_code, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // 各商品の票数と自分の投票状況を一括取得
  const productIds = (products ?? []).map((p) => p.id)

  let votesMap: Record<string, { approve: number; reject: number; myVote: string | null }> = {}

  if (productIds.length > 0) {
    const { data: allVotes } = await supabase
      .from('product_votes')
      .select('product_id, vote, voter_token')
      .in('product_id', productIds)

    for (const id of productIds) {
      const pvotes = (allVotes ?? []).filter((v) => v.product_id === id)
      votesMap[id] = {
        approve: pvotes.filter((v) => v.vote === 'approve').length,
        reject: pvotes.filter((v) => v.vote === 'reject').length,
        myVote: pvotes.find((v) => v.voter_token === voterToken)?.vote ?? null,
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">審査中の商品</h2>
          <p className="text-xs text-gray-400">
            ユーザーが投稿した商品です。内容が正しければ「✅ 正しい」を押してください。<br />
            3票集まると公開されます。
          </p>
        </div>

        {/* 投稿完了メッセージ */}
        {submitted && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-500 text-lg font-bold">
              ✓
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">商品を登録しました！</p>
              <p className="text-xs text-gray-500 mt-0.5">
                他のユーザーが内容を確認すると公開されます。
              </p>
            </div>
          </div>
        )}

        {products && products.length > 0 ? (
          products.map((product) => {
            const votes = votesMap[product.id] ?? { approve: 0, reject: 0, myVote: null }
            const isNew = product.id === submitted
            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow-sm p-5 ${isNew ? 'ring-2 ring-orange-400' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                    画像
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    {product.store_name && (
                      <p className="text-xs text-gray-500 mt-1">{product.store_name}</p>
                    )}
                    <p className="font-medium text-gray-900 mt-0.5">{product.name}</p>
                    {product.jan_code ? (
                      <p className="text-xs text-gray-400 mt-0.5">JAN: {product.jan_code}</p>
                    ) : (
                      <p className="text-xs text-gray-300 mt-0.5">JANコードなし</p>
                    )}
                  </div>
                </div>

                {/* 票数バー */}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  <span className="text-green-600 font-medium">✅ {votes.approve}/3票</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-green-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min((votes.approve / 3) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-red-400">{votes.reject}票否決</span>
                </div>

                <VoteButton productId={product.id} hasVoted={votes.myVote !== null} />
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
            <p className="text-sm">現在、審査中の商品はありません</p>
          </div>
        )}
      </main>
    </div>
  )
}
