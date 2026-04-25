export const GA_ID = 'G-5V0Z78HK82'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

type GTagParams = Record<string, string | number | boolean | undefined>

/** GAカスタムイベントを送信する共通関数 */
export function trackEvent(action: string, params?: GTagParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', action, params)
}
