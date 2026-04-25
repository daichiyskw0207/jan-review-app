import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/app/lib/supabase-server'
import AppHeader from '@/app/components/AppHeader'
import TutorialForm from './TutorialForm'

// 生年月日から年齢を計算
function calcAge(birthday: string | null): number | null {
  if (!birthday) return null
  const birth = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// 年代×性別でチュートリアル商品のJANコードを決定
function getTutorialJanCode(age: number | null, gender: string | null): string {
  const COCA_COLA  = '4902102072541'
  const JAGARIKO  = '4901340209876'
  const POTECHIPS = '4901340198765'
  const SARAN     = '4901670112233'
  const SOUKENMITYA = '4902102112637'

  if (age === null) {
    // 生年月日未登録
    return gender === 'female' ? JAGARIKO : COCA_COLA
  }
  if (age < 20) {
    return gender === 'female' ? JAGARIKO : COCA_COLA
  }
  if (age < 40) {
    if (gender === 'male') return COCA_COLA
    return JAGARIKO  // female / no_answer
  }
  if (age < 60) {
    if (gender === 'female') return SARAN
    if (gender === 'no_answer') return POTECHIPS
    return COCA_COLA  // male
  }
  // 60代以上
  return SOUKENMITYA
}

export default async function TutorialPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, birthday, gender, tutorial_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.nickname) redirect('/profile/setup')
  if (profile.tutorial_completed) redirect('/')

  // チュートリアル用商品を選択
  const age = calcAge(profile.birthday)
  const janCode = getTutorialJanCode(age, profile.gender)

  const { data: product } = await supabase
    .from('products')
    .select('id, name, category, store_name')
    .eq('jan_code', janCode)
    .maybeSingle()

  // 見つからない場合はデフォルト商品
  const tutorialProduct = product ?? (await supabase
    .from('products')
    .select('id, name, category, store_name')
    .limit(1)
    .single()
    .then(r => r.data))

  if (!tutorialProduct) redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-lg mx-auto px-4 py-8 pb-16">
        {/* ウェルカムバナー */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 mb-6 text-white shadow-md">
          <p className="text-orange-100 text-sm mb-1">はじめての口コミ</p>
          <h1 className="text-xl font-bold mb-2">
            {profile.nickname}さん、ようこそ！
          </h1>
          <p className="text-sm text-orange-50 leading-relaxed">
            下の商品についての感想を入力するだけ。<br />
            あなたの口コミが他のユーザーの参考になります✨
          </p>
        </div>

        <TutorialForm
          product={tutorialProduct}
          nickname={profile.nickname}
        />
      </main>
    </div>
  )
}
