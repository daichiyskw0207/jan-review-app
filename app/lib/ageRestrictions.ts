// ──────────────────────────────────────────────
// 年齢制限ルール定義
// ──────────────────────────────────────────────

export type AgeRestriction = {
  minAge: number
  categoryLabel: string   // 表示用カテゴリ名
  lawBasis: string        // 根拠（表示用）
}

/** カテゴリ名に含まれるキーワードで判定するルール（上から順に評価） */
const RULES: { pattern: RegExp; restriction: AgeRestriction }[] = [
  {
    pattern: /アルコール|お酒|ビール|ワイン|日本酒|焼酎|チューハイ|ウイスキー|ウィスキー|ブランデー|ジン|ラム|テキーラ|梅酒|リキュール|発泡酒|酒類|洋酒|スパークリング/i,
    restriction: {
      minAge: 20,
      categoryLabel: 'アルコール類',
      lawBasis: '未成年者飲酒禁止法により、20歳未満の方はアルコール商品の口コミ投稿・閲覧は推奨されません',
    },
  },
  {
    pattern: /アダルト|成人向け|18禁|大人向け|大人のおもちゃ|アダルトグッズ|セクシー|避妊|コンドーム|ラブグッズ/i,
    restriction: {
      minAge: 18,
      categoryLabel: '成人向け商品',
      lawBasis: '18歳未満の方は成人向け商品の口コミ投稿・閲覧は推奨されません',
    },
  },
]

/** 商品の min_age カラムを AgeRestriction に変換 */
const MIN_AGE_DEFAULTS: Record<number, Pick<AgeRestriction, 'categoryLabel' | 'lawBasis'>> = {
  20: {
    categoryLabel: 'アルコール類',
    lawBasis: '未成年者飲酒禁止法により、20歳未満の方はアルコール商品の口コミ投稿・閲覧は推奨されません',
  },
  18: {
    categoryLabel: '成人向け商品',
    lawBasis: '18歳未満の方は成人向け商品の口コミ投稿・閲覧は推奨されません',
  },
}

/**
 * 商品の min_age（DB カラム）とカテゴリ名の両方から年齢制限を取得。
 * min_age が設定されていればそちらを優先。制限なしなら null。
 */
export function getAgeRestriction(
  category: string | null | undefined,
  minAge?: number | null,
): AgeRestriction | null {
  // DB カラム優先
  if (minAge != null && minAge > 0) {
    const defaults = MIN_AGE_DEFAULTS[minAge] ?? {
      categoryLabel: '年齢制限商品',
      lawBasis: `${minAge}歳未満の方はこの商品の口コミ投稿・閲覧は推奨されません`,
    }
    return { minAge, ...defaults }
  }
  // カテゴリ名パターン
  if (!category) return null
  for (const rule of RULES) {
    if (rule.pattern.test(category)) return rule.restriction
  }
  return null
}

/** 誕生日文字列（YYYY-MM-DD）から現在の年齢を計算 */
export function calcAge(birthday: string | null | undefined): number | null {
  if (!birthday) return null
  const birth = new Date(birthday)
  if (isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
  return age
}

/** 年齢制限に対してユーザーが投稿できるか判定し、理由を返す */
export type AgeCheckResult =
  | { allowed: true }
  | { allowed: false; reason: 'not_logged_in' }
  | { allowed: false; reason: 'no_birthday' }
  | { allowed: false; reason: 'too_young'; age: number; minAge: number }

export function checkAgeForPost(
  restriction: AgeRestriction,
  birthday: string | null | undefined,
  isLoggedIn: boolean,
): AgeCheckResult {
  if (!isLoggedIn) return { allowed: false, reason: 'not_logged_in' }
  const age = calcAge(birthday)
  if (age === null) return { allowed: false, reason: 'no_birthday' }
  if (age < restriction.minAge) return { allowed: false, reason: 'too_young', age, minAge: restriction.minAge }
  return { allowed: true }
}
