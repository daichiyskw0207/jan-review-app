import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'

export const metadata = { title: '企業向け利用規約 | JAN口コミ' }

export default function CompanyTermsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded-full">企業向け</span>
            <h1 className="text-2xl font-bold text-gray-900">企業会員利用規約</h1>
          </div>
          <p className="text-xs text-gray-400 mb-8">制定日：2025年4月24日</p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            本企業会員利用規約（以下「本規約」）は、JAN口コミ（以下「当社」）が提供する企業向けマイページサービス（以下「本企業サービス」）の利用条件を定めるものです。企業会員として登録を申請し、または本企業サービスを利用することにより、本規約および<Link href="/terms" className="text-orange-500 underline">一般利用規約</Link>・<Link href="/privacy" className="text-orange-500 underline">プライバシーポリシー</Link>に同意したものとみなします。
          </p>

          <Section id="1" title="第1条（定義）">
            <ul>
              <li>「企業会員」とは、当社の審査を経て本企業サービスの利用を承認された法人または個人事業主をいいます。</li>
              <li>「マイページ」とは、企業会員が利用できる専用管理画面をいいます。</li>
              <li>「口コミデータ」とは、本サービス上に蓄積された商品に関するレビュー・評価スコア・ハッシュタグ・ユーザー属性情報等の総称をいいます。</li>
              <li>「マーケティングソリューション」とは、当社が企業会員に対して提供する口コミデータの分析・提供サービスをいいます。</li>
              <li>「担当者」とは、企業会員が本企業サービスを利用するために登録した従業員・委託先等をいいます。</li>
            </ul>
          </Section>

          <Section id="2" title="第2条（申請・審査・登録）">
            <ul>
              <li>本企業サービスの利用を希望する法人・個人事業主は、当社所定の申請フォームから登録申請を行うものとします。</li>
              <li>申請にあたっては、真実・正確な情報を提供するものとします。虚偽の申請が判明した場合、当社はいつでも登録を取り消すことができます。</li>
              <li>当社は、申請内容を審査のうえ承認・却下を決定します。審査基準・審査結果の理由は開示しません。</li>
              <li>登録完了後、申請時のメールアドレスに紐付いたアカウントにてマイページにアクセスできます。</li>
            </ul>
          </Section>

          <Section id="3" title="第3条（担当者の管理）">
            <ul>
              <li>企業会員は、マイページ上で最大10名の担当者（氏名・役職・メールアドレス・電話番号）を登録できます。</li>
              <li>担当者の行為はすべて企業会員の行為とみなします。企業会員は担当者が本規約を遵守するよう管理する責任を負います。</li>
              <li>退職・異動等により担当者が変更となった場合は、速やかにマイページ上で情報を更新するものとします。</li>
              <li>担当者のアカウント情報の漏洩・不正利用により生じた損害について、当社は責任を負いません。</li>
            </ul>
          </Section>

          <Section id="4" title="第4条（提供機能）">
            <p>本企業サービスでは以下の機能を提供します。</p>
            <ul>
              <li>自社商品に投稿された口コミ・評価の閲覧</li>
              <li>自社商品への画像登録（1商品あたり1枚・5MB以内）</li>
              <li>JANコード・商品情報のCSV一括登録</li>
              <li>口コミトレンド・ハッシュタグ分析の閲覧</li>
              <li>担当者情報の管理（最大10名）</li>
            </ul>
            <p className="mt-2">提供機能は当社の判断により追加・変更・廃止される場合があります。</p>
          </Section>

          <Section id="5" title="第5条（口コミデータの取り扱い）">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700">1. 閲覧権限の範囲</p>
                <p>企業会員が閲覧できる口コミデータは、原則として自社商品に紐付いたものに限ります。ユーザーの個人情報（氏名・連絡先等）は提供しません。</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">2. データの利用目的の制限</p>
                <p>企業会員は、閲覧した口コミデータを自社の商品開発・品質改善・マーケティング目的にのみ利用できます。第三者への転売・提供、または投稿者の特定を目的とした利用は禁止します。</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">3. マーケティングソリューションの別途契約</p>
                <p>競合商品の口コミデータ・業界全体のトレンド分析・ユーザー属性別の詳細分析等、標準機能を超えるデータ提供については、別途マーケティングソリューション契約が必要です。詳細はお問い合わせください。</p>
              </div>
            </div>
          </Section>

          <Section id="6" title="第6条（商品情報・画像の登録）">
            <ul>
              <li>企業会員は、自社が製造・販売する商品のJANコードおよび商品画像を登録できます。</li>
              <li>登録する商品情報・画像は正確であり、第三者の著作権・商標権等を侵害しないものとします。</li>
              <li>登録された画像は本サービス上に公開され、口コミページや検索結果での表示に利用されます。</li>
              <li>虚偽・誤解を招く商品情報の登録は禁止します。当社は事前通知なく当該情報を削除できます。</li>
              <li>登録した画像・情報に関する第三者からのクレームについて、企業会員が一切の責任を負うものとします。</li>
            </ul>
          </Section>

          <Section id="7" title="第7条（禁止事項）">
            <p>企業会員は以下の行為を行ってはなりません。</p>
            <ul>
              <li>自社商品への意図的な高評価口コミの誘導・依頼・投稿（いわゆる「やらせレビュー」）</li>
              <li>競合他社商品への意図的な低評価口コミの誘導・依頼・投稿</li>
              <li>口コミ投稿者への個別接触・特定を試みる行為</li>
              <li>本企業サービスを通じて取得した情報の第三者への無断提供・転売</li>
              <li>マイページへの不正アクセス・システムへの攻撃</li>
              <li>当社の事前承諾なく、本企業サービスの機能をAPIやスクレイピング等で自動取得する行為</li>
              <li>反社会的勢力との関与・利益供与</li>
              <li>その他法令または本規約・一般利用規約に違反する行為</li>
            </ul>
          </Section>

          <Section id="8" title="第8条（知的財産権）">
            <ul>
              <li>本企業サービス・口コミデータ・分析レポートに関する知的財産権は当社または正当な権利者に帰属します。</li>
              <li>企業会員が登録した商品情報・画像の著作権は企業会員に帰属しますが、本サービスの運営・改善・プロモーション目的での利用を当社に許諾するものとします。</li>
            </ul>
          </Section>

          <Section id="9" title="第9条（料金・支払い）">
            <ul>
              <li>基本的なマイページ機能（口コミ閲覧・画像登録・担当者管理等）は、当社が別途定める期間、無償で提供します。</li>
              <li>マーケティングソリューション（詳細データ分析・レポート提供等）は有償サービスとなります。料金・支払い条件は別途契約書に定めます。</li>
              <li>有償サービスの料金は当社の判断により変更される場合があり、変更の30日前までに通知します。</li>
            </ul>
          </Section>

          <Section id="10" title="第10条（秘密保持）">
            <ul>
              <li>企業会員は、本企業サービスを通じて取得した情報（口コミデータ・分析結果・当社の業務情報等）を秘密として管理し、第三者に開示・漏洩してはなりません。</li>
              <li>本条の義務は、本企業サービスの利用終了後も3年間継続します。</li>
            </ul>
          </Section>

          <Section id="11" title="第11条（サービスの停止・終了）">
            <ul>
              <li>当社は、以下の場合に企業会員のマイページ利用を停止・終了できます。
                <ul>
                  <li>本規約または一般利用規約に違反した場合</li>
                  <li>登録情報に虚偽が判明した場合</li>
                  <li>反社会的勢力との関係が判明した場合</li>
                  <li>その他当社が不適切と判断した場合</li>
                </ul>
              </li>
              <li>当社は、事業上の理由により本企業サービスを終了する場合、60日前までに通知します。</li>
            </ul>
          </Section>

          <Section id="12" title="第12条（免責事項）">
            <ul>
              <li>当社は、口コミデータの正確性・完全性・有用性を保証しません。</li>
              <li>本企業サービスの利用または利用不能により企業会員に生じた損害について、当社の故意または重過失による場合を除き、責任を負いません。</li>
              <li>企業会員が本規約に違反して第三者に損害を与えた場合、企業会員が一切の責任を負います。</li>
            </ul>
          </Section>

          <Section id="13" title="第13条（規約の変更）">
            <ul>
              <li>当社は、必要に応じて本規約を変更できます。重要な変更は、30日前までにマイページまたは登録メールにてお知らせします。</li>
              <li>変更後に本企業サービスを継続利用した場合、変更後の規約に同意したものとみなします。</li>
            </ul>
          </Section>

          <Section id="14" title="第14条（準拠法・管轄裁判所）">
            <ul>
              <li>本規約は日本法に準拠して解釈されます。</li>
              <li>本企業サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ul>
          </Section>

          <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
            <p>※ 本規約はAIを活用して作成されたものであり、法的助言を構成するものではありません。実際のサービス運営にあたっては、弁護士等の専門家にご確認ください。</p>
            <div className="mt-4 flex gap-4 flex-wrap">
              <Link href="/terms"    className="text-orange-500 underline">一般利用規約</Link>
              <Link href="/privacy"  className="text-orange-500 underline">プライバシーポリシー</Link>
              <Link href="/company/apply" className="text-orange-500 underline">企業マイページ申請</Link>
              <Link href="/"         className="text-gray-500 underline">トップへ戻る</Link>
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
      <div className="text-sm text-gray-600 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul_ul]:list-circle [&_ul_ul]:mt-1">
        {children}
      </div>
    </section>
  )
}
