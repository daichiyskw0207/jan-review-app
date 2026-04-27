import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'

export const metadata = { title: 'プライバシーポリシー | ロコミー' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">プライバシーポリシー</h1>
          <p className="text-xs text-gray-400 mb-8">制定日：2025年4月24日</p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            ロコミー（以下「当社」）は、本サービスにおけるユーザーの個人情報・利用データの取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。本サービスの利用をもって本ポリシーに同意したものとみなします。
          </p>

          <Section id="1" title="第1条（収集する情報）">
            <p>当社は以下の情報を収集します。</p>
            <div className="space-y-3 mt-2">
              <div>
                <p className="font-medium text-gray-700">1. ユーザーが直接提供する情報</p>
                <ul>
                  <li>ニックネーム・プロフィール情報（生年月日・性別・都道府県・職業）</li>
                  <li>ソーシャルログイン経由で取得する情報（氏名・メールアドレス・アイコン画像）</li>
                  <li>投稿した口コミ・評価スコア・ハッシュタグ</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700">2. サービス利用に伴い自動収集する情報</p>
                <ul>
                  <li>閲覧・検索履歴（閲覧商品・検索キーワード・JANコード）</li>
                  <li>評価・投稿行動（投稿日時・カテゴリ・使用ハッシュタグ・評価傾向）</li>
                  <li>デバイス情報（OS・ブラウザ・デバイス種別）</li>
                  <li>IPアドレス・アクセスログ</li>
                  <li>Cookie・ローカルストレージ等の識別子</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="2" title="第2条（利用目的）">
            <p>当社は収集した情報を以下の目的で利用します。</p>
            <ul>
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザー認証・アカウント管理</li>
              <li>パーソナライズされた商品レコメンデーションの提供</li>
              <li>ポイント・バッジ等のゲーミフィケーション機能の運営</li>
              <li>不正利用の検知・防止</li>
              <li>サービスに関するお知らせ・重要連絡</li>
              <li>第3条に定めるデータの第三者提供・広告配信</li>
              <li>統計分析・マーケティングリサーチ</li>
            </ul>
          </Section>

          <Section id="3" title="第3条（データの第三者提供）">
            <p className="font-medium text-gray-800">当社は以下の場合に個人情報・利用データを第三者に提供します。</p>
            <div className="space-y-4 mt-3">
              <div>
                <p className="font-medium text-gray-700">1. マーケティングデータの提供・販売</p>
                <p>当社は、食品・飲料メーカー、小売業者その他の企業に対し、以下のデータをマーケティングソリューションとして提供・販売します。</p>
                <ul>
                  <li>商品カテゴリ別・地域別・属性別の口コミ傾向・評価スコアの集計データ</li>
                  <li>消費者の購買行動・嗜好分析レポート</li>
                  <li>ハッシュタグ・キーワードトレンドの分析データ</li>
                  <li>公開された個別の口コミコンテンツ（個人を特定できない形に処理した上で提供する場合があります）</li>
                </ul>
                <p className="mt-1">これらのデータは、提携企業による商品開発・マーケティング戦略立案・販売促進等の目的で活用されます。</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">2. 広告配信事業者への提供</p>
                <p>当社は、ターゲティング広告の配信最適化を目的として、広告配信事業者・広告ネットワーク事業者に対し、ユーザーの行動履歴・属性情報等を提供することがあります。提供されたデータは、当該事業者のプライバシーポリシーに従って管理されます。</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">3. 法令に基づく場合</p>
                <p>裁判所・警察等の公的機関から法令に基づく開示請求があった場合。</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">4. 業務委託先</p>
                <p>サービス運営に必要な範囲で、業務委託先（サーバー管理・分析ツール等）に情報を提供することがあります。委託先には適切な安全管理措置を講じさせます。</p>
              </div>
            </div>
          </Section>

          <Section id="4" title="第4条（広告配信）">
            <ul>
              <li>当社は、ユーザーの投稿履歴・閲覧履歴・プロフィール情報（年齢層・性別・居住地・職業等）に基づき、関心に合わせたターゲティング広告を配信します。</li>
              <li>広告配信には、Google、Meta等の第三者広告プラットフォームを利用する場合があります。これらのプラットフォームは独自のCookieやトラッキング技術を使用することがあります。</li>
              <li>ターゲティング広告を希望しない場合は、設定画面からオプトアウトできます（機能提供時）。</li>
            </ul>
          </Section>

          <Section id="5" title="第5条（Cookieおよびトラッキング技術）">
            <ul>
              <li>当社は、サービスの利便性向上・利用状況分析・広告配信最適化のため、Cookie・ローカルストレージ・ウェブビーコン等のトラッキング技術を使用します。</li>
              <li>ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。</li>
              <li>当社はGoogle Analytics等のアクセス解析ツールを使用する場合があります。</li>
            </ul>
          </Section>

          <Section id="6" title="第6条（データの保管・管理）">
            <ul>
              <li>当社は、収集した情報を適切なセキュリティ措置のもとで管理します。</li>
              <li>個人情報はサービス提供に必要な期間保持します。退会後も、法令上の義務・正当なビジネス目的のため一定期間保持することがあります。</li>
              <li>匿名化・統計処理されたデータは退会後も保持・活用される場合があります。</li>
            </ul>
          </Section>

          <Section id="7" title="第7条（ユーザーの権利）">
            <p>ユーザーは以下の権利を有します。</p>
            <ul>
              <li>保有する個人情報の開示・訂正・削除の請求</li>
              <li>個人情報の利用停止・第三者提供停止の請求</li>
              <li>退会によるアカウントの削除</li>
            </ul>
            <p className="mt-2">これらの請求は、お問い合わせフォームよりご連絡ください。なお、法令上保持が必要な情報については対応できない場合があります。</p>
          </Section>

          <Section id="8" title="第8条（子どものプライバシー）">
            <p>本サービスは13歳未満の方を対象としていません。13歳未満のユーザーが個人情報を提供した事実が判明した場合、当社は当該情報を速やかに削除します。</p>
          </Section>

          <Section id="9" title="第9条（ポリシーの変更）">
            <ul>
              <li>当社は、法令の改正・サービス内容の変更等に伴い、本ポリシーを変更することがあります。</li>
              <li>重要な変更を行う場合は、本サービス上での告知または登録メールアドレスへの通知により事前にお知らせします。</li>
              <li>変更後に本サービスを利用した場合、変更後のポリシーに同意したものとみなします。</li>
            </ul>
          </Section>

          <Section id="10" title="第10条（お問い合わせ）">
            <p>個人情報の取り扱いに関するお問い合わせ・苦情・請求については、以下の窓口までご連絡ください。</p>
            <div className="mt-2 bg-gray-50 rounded-lg p-4 text-sm">
              <p>ロコミー 個人情報取り扱い窓口</p>
              <p className="text-gray-400 mt-1">（お問い合わせ窓口は準備中です）</p>
            </div>
          </Section>

          <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
            <p>※ 本ポリシーはAIを活用して作成されたものであり、法的助言を構成するものではありません。実際のサービス運営にあたっては、弁護士・個人情報保護の専門家にご確認ください。</p>
            <div className="mt-4 flex gap-4">
              <Link href="/terms" className="text-orange-500 underline">利用規約</Link>
              <Link href="/" className="text-gray-500 underline">トップへ戻る</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8" id={`section-${id}`}>
      <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  )
}
