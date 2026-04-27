'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/app/lib/supabase-browser'

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
]

const OCCUPATIONS = [
  { value: 'company_employee', label: '会社員' },
  { value: 'civil_servant',    label: '公務員' },
  { value: 'self_employed',    label: '自営業・フリーランス' },
  { value: 'student',          label: '学生' },
  { value: 'homemaker',        label: '主婦・主夫' },
  { value: 'part_time',        label: 'パート・アルバイト' },
  { value: 'unemployed',       label: '無職' },
  { value: 'other',            label: 'その他' },
]

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

export default function ProfileForm() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [nickname, setNickname]       = useState('')
  const [username, setUsername]       = useState('')
  const [birthday, setBirthday]       = useState('')
  const [gender, setGender]           = useState('')
  const [prefecture, setPrefecture]   = useState('')
  const [occupation, setOccupation]   = useState('')
  const [newsletterConsent, setNewsletterConsent] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'ok' | 'taken' | 'invalid'>('idle')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // 候補 username を生成（最大8件）
  function generateCandidates(base: string): string[] {
    const year2 = String(new Date().getFullYear()).slice(-2)
    const candidates = [
      `${base}_${year2}`,
      `${base}1`, `${base}2`, `${base}3`,
      `${base}_1`, `${base}_2`,
      `${base}123`, `${base}007`,
    ]
    // 20文字を超えるものは base を短縮して調整
    return candidates
      .map((c) => c.slice(0, 20))
      .filter((c) => USERNAME_REGEX.test(c))
  }

  // username の重複チェック
  const checkUsername = useCallback(async (value: string) => {
    if (!value) { setUsernameStatus('idle'); setSuggestions([]); return }
    if (!USERNAME_REGEX.test(value)) { setUsernameStatus('invalid'); setSuggestions([]); return }
    setUsernameStatus('checking')
    setSuggestions([])

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', value)
      .maybeSingle()

    if (!data) {
      setUsernameStatus('ok')
      return
    }

    // 取得済み → 候補を並列チェック
    setUsernameStatus('taken')
    const candidates = generateCandidates(value)
    const results = await Promise.all(
      candidates.map((c) =>
        supabase.from('profiles').select('id').eq('username', c).maybeSingle()
          .then(({ data: d }) => ({ name: c, taken: !!d }))
      )
    )
    setSuggestions(results.filter((r) => !r.taken).map((r) => r.name).slice(0, 3))
  }, [supabase])

  function applySuggestion(s: string) {
    setUsername(s)
    setSuggestions([])
    checkUsername(s)
  }

  function handleUsernameChange(value: string) {
    setUsername(value)
    setSuggestions([])

    // 使えない文字が含まれていたら即エラー（debounce なし）
    if (value && /[^a-zA-Z0-9_]/.test(value)) {
      setUsernameStatus('invalid')
      return
    }

    // 長さ・形式チェックと重複確認は debounce
    setUsernameStatus('idle')
    const trimmed = value.trim()
    const timer = setTimeout(() => checkUsername(trimmed), 400)
    return () => clearTimeout(timer)
  }

  // OAuth プロバイダーからデフォルト username を導出
  useEffect(() => {
    async function loadDefault() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const provider = user.app_metadata?.provider as string | undefined
      let raw = ''

      if (provider === 'google' || provider === 'facebook') {
        // Gmail / Meta 登録メールの @ 以前
        raw = (user.email ?? user.user_metadata?.email ?? '').split('@')[0]
      } else if (provider === 'twitter') {
        // X (Twitter) のハンドル名
        raw = user.user_metadata?.user_name
           ?? user.user_metadata?.preferred_username
           ?? (user.email ?? '').split('@')[0]
      } else if (provider === 'line') {
        // LINE はユーザー名なし → 表示名をフォールバック
        raw = user.user_metadata?.name
           ?? user.user_metadata?.full_name
           ?? (user.email ?? '').split('@')[0]
      } else {
        raw = (user.email ?? '').split('@')[0]
      }

      // 使える文字だけ残して小文字化・長さ調整
      const cleaned = raw
        .toLowerCase()
        .replace(/[-.\s@]/g, '_')   // ハイフン・ドット・スペース → _
        .replace(/[^a-z0-9_]/g, '') // それ以外は除去
        .replace(/^_+|_+$/g, '')    // 先頭・末尾の _ を除去
        .slice(0, 20)

      if (cleaned.length >= 3) {
        setUsername(cleaned)
        checkUsername(cleaned)
      }
    }
    loadDefault()
  }, [supabase, checkUsername])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) { setError('ニックネームを入力してください'); return }
    if (!username.trim()) { setError('ユーザーIDを入力してください'); return }
    if (!USERNAME_REGEX.test(username)) {
      setError('ユーザーIDは半角英数字・アンダースコアで3〜20文字にしてください')
      return
    }
    if (usernameStatus === 'taken') { setError('このユーザーIDはすでに使われています'); return }
    if (!birthday) { setError('生年月日を入力してください'); return }
    if (!gender) { setError('性別を選択してください'); return }
    if (!prefecture) { setError('都道府県を選択してください'); return }
    if (!occupation) { setError('職業を選択してください'); return }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      setLoading(false)
      return
    }

    const now = new Date().toISOString()
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        nickname:   nickname.trim(),
        username:   username.trim().toLowerCase(),
        birthday:   birthday   || null,
        gender:     gender     || null,
        prefecture: prefecture || null,
        occupation: occupation || null,
        email:      user.email || null,
        newsletter_consent: newsletterConsent,
        newsletter_consent_at: newsletterConsent ? now : null,
        updated_at: now,
      })

    if (upsertError) {
      setError('保存に失敗しました。もう一度お試しください。')
      setLoading(false)
      return
    }

    router.push('/tutorial')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ニックネーム */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ニックネーム <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例：口コミ太郎"
          maxLength={20}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <p className="text-xs text-gray-400 mt-1">{nickname.length}/20文字</p>
      </div>

      {/* ユーザーID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ユーザーID <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="例：taro_123"
            maxLength={20}
            className="w-full border border-gray-300 rounded-lg pl-8 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {usernameStatus === 'checking' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">確認中…</span>
          )}
          {usernameStatus === 'ok' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-base">✓</span>
          )}
          {usernameStatus === 'taken' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-base">✗</span>
          )}
        </div>
        <p className="text-xs mt-1 leading-relaxed">
          {usernameStatus === 'taken' && (
            <span className="text-red-500">このユーザーIDはすでに使われています</span>
          )}
          {usernameStatus === 'taken' && suggestions.length > 0 && (
            <span className="block mt-1.5">
              <span className="text-gray-400">候補: </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  className="mr-1.5 text-orange-500 underline hover:text-orange-600 font-medium"
                >
                  @{s}
                </button>
              ))}
            </span>
          )}
          {usernameStatus === 'invalid' && (
            <span className="text-red-500">
              {username && /[^a-zA-Z0-9_]/.test(username)
                ? `使えない文字が含まれています（使えるのは半角英数字・アンダースコアのみ）`
                : '半角英数字・アンダースコア（_）で3〜20文字にしてください'}
            </span>
          )}
          {usernameStatus === 'ok' && <span className="text-green-600">使用できます</span>}
          {(usernameStatus === 'idle' || usernameStatus === 'checking') && (
            <span className="text-gray-400">半角英数字・アンダースコア（_）で3〜20文字。あとから変更できます。</span>
          )}
        </p>
      </div>

      {/* 生年月日 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          生年月日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 性別 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          性別 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {[
            { value: 'male',      label: '男性' },
            { value: 'female',    label: '女性' },
            { value: 'no_answer', label: '答えない' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(gender === opt.value ? '' : opt.value)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                gender === opt.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-orange-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 都道府県 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          お住まいの都道府県 <span className="text-red-500">*</span>
        </label>
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">選択してください</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>{pref}</option>
          ))}
        </select>
      </div>

      {/* 職業 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          職業 <span className="text-red-500">*</span>
        </label>
        <select
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">選択してください</option>
          {OCCUPATIONS.map((occ) => (
            <option key={occ.value} value={occ.value}>{occ.label}</option>
          ))}
        </select>
      </div>

      {/* メルマガ同意 */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={newsletterConsent}
            onChange={(e) => setNewsletterConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              メールマガジンを受け取る（任意）
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              ロコミーからの新着情報・キャンペーン・口コミトレンドなどをお届けします。
              いつでも設定画面から解除できます。
            </p>
          </div>
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {loading ? '保存中...' : 'プロフィールを保存する'}
      </button>
    </form>
  )
}
