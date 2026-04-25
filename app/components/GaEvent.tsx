'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/app/lib/gtag'

interface Props {
  action: string
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * サーバーコンポーネントのページでGAイベントを発火するための
 * クライアントコンポーネント。レンダリング時に1回だけ発火する。
 */
export default function GaEvent({ action, params }: Props) {
  useEffect(() => {
    trackEvent(action, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
