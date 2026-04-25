'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/app/lib/gtag'

interface Props {
  productId: string
  productName: string
  category?: string
}

export default function ProductViewTracker({ productId, productName, category }: Props) {
  useEffect(() => {
    trackEvent('product_view', {
      product_id: productId,
      product_name: productName,
      category,
    })
  }, [productId, productName, category])
  return null
}
