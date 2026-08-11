import { useEffect, useState } from 'react'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'

function HomeProductImage({ product, className, alt = '' }) {
  const [src, setSrc] = useState(product?.image || FALLBACK_IMAGE)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
    setSrc(product?.image || FALLBACK_IMAGE)
  }, [product?.id, product?.image])

  return (
    <img
      src={hasError ? FALLBACK_IMAGE : src}
      alt={alt || product?.name || '상품'}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

export default HomeProductImage
