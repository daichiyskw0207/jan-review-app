'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/app/lib/gtag'

/**
 * URLの ?ga=event_name を読み取ってGAイベントを発火する。
 * ログイン・会員登録などサーバーActionのリダイレクト後に使用。
 */
export default function GaFromUrl() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ga = searchParams.get('ga')
    if (!ga) return
    trackEvent(ga)
  }, [searchParams])

  return null
}
