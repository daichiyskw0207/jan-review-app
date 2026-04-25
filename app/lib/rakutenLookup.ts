export type RakutenLookupResult =
  | {
      found: true
      name: string
      brand?: string
      price?: number
      imageUrl?: string
    }
  | { found: false }

/**
 * Yahoo! ショッピング API で JAN コードから商品情報を取得する
 */
export async function lookupByJanCode(janCode: string): Promise<RakutenLookupResult> {
  const appId = process.env.YAHOO_CLIENT_ID
  if (!appId) {
    console.warn('YAHOO_CLIENT_ID が設定されていません')
    return { found: false }
  }

  try {
    // V3 API: jan_code パラメータで検索
    const params = new URLSearchParams({
      appid: appId,
      jan_code: janCode,
      hits: '1',
      results: 'hits',
    })

    const res = await fetch(
      `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      console.error('[Yahoo] HTTP error:', res.status, await res.text())
      return { found: false }
    }

    const data = await res.json()
    console.log('[Yahoo] response:', JSON.stringify(data).slice(0, 800))
    const hits = data.hits
    if (!hits || hits.length === 0) {
      // V1 API にフォールバック
      const v1params = new URLSearchParams({
        appid: appId,
        jan: janCode,
        results: '1',
      })
      const v1res = await fetch(
        `https://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?${v1params}`,
        { cache: 'no-store' }
      )
      if (!v1res.ok) return { found: false }
      const v1data = await v1res.json()
      console.log('[Yahoo V1] response:', JSON.stringify(v1data).slice(0, 800))
      const v1items = v1data.ResultSet?.Result?.Hit
      if (!v1items || v1items.length === 0) return { found: false }
      const v1item = Array.isArray(v1items) ? v1items[0] : v1items
      return {
        found: true,
        name: v1item.Name as string,
        brand: v1item.Brand?.Name ?? undefined,
        price: v1item.Price?.value ? Number(v1item.Price.value) : undefined,
        imageUrl: v1item.Image?.Medium ?? undefined,
      }
    }

    const item = hits[0]
    return {
      found: true,
      name: item.name as string,
      brand: item.brand?.name ?? item.seller?.name ?? undefined,
      price: item.price ? Number(item.price) : undefined,
      imageUrl: item.image?.medium ?? undefined,
    }
  } catch (e) {
    console.error('[Yahoo] fetch error:', e)
    return { found: false }
  }
}
