import AppHeader from '@/app/components/AppHeader'

export const metadata = { title: '特定商取引法に基づく表記 | ロコミー' }

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-gray-100">
      <th className="py-4 pr-6 text-left text-sm font-medium text-gray-500 align-top w-40 shrink-0">
        {label}
      </th>
      <td className="py-4 text-sm text-gray-700 leading-relaxed">{children}</td>
    </tr>
  )
}

export default function TokushoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">特定商取引法に基づく表記</h1>
          <p className="text-xs text-gray-400 mb-8">最終更新日：2025年4月27日</p>

          <table className="w-full">
            <tbody>
              <Row label="サービス名">ロコミー</Row>
              <Row label="運営者">個人運営</Row>
              <Row label="所在地">
                <span className="text-gray-400">準備中（お問い合わせいただければ開示いたします）</span>
              </Row>
              <Row label="お問い合わせ">
                <a href="/contact" className="text-orange-500 underline">お問い合わせフォーム</a>よりご連絡ください
              </Row>
              <Row label="サービス内容">
                バーコードをスキャンして食品・日用品などの商品口コミを投稿・閲覧できる無料Webサービス
              </Row>
              <Row label="利用料金">
                無料（一部アフィリエイト広告を掲載しています）
              </Row>
              <Row label="支払方法">該当なし（無料サービス）</Row>
              <Row label="返品・キャンセル">該当なし（無料サービス）</Row>
            </tbody>
          </table>

          <p className="mt-8 text-xs text-gray-400 leading-relaxed">
            ※ 本サービスは現在個人が運営しております。法人化・住所の公開等については準備が整い次第更新いたします。
          </p>
        </div>
      </main>
    </div>
  )
}
