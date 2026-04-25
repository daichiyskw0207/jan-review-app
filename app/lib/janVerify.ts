export type JanVerifyResult =
  | { found: true; productName: string }
  | { found: false }

export async function verifyJanCode(janCode: string): Promise<JanVerifyResult> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(janCode)}.json`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return { found: false }
    const data = await res.json()
    if (data.status === 1 && data.product?.product_name) {
      return { found: true, productName: data.product.product_name }
    }
    return { found: false }
  } catch {
    return { found: false }
  }
}
