import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'
import WishlistHeart from '@/components/product/WishlistHeart'

function ProductImage({ product, className }) {
  const [src, setSrc] = useState(product.image || FALLBACK_IMAGE)

  return (
    <img
      src={src}
      alt={product.name}
      className={className}
      loading="lazy"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  )
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <ProductImage product={product} className="product-card__image" />
          {product.hasDiscount && product.discountRate != null && (
            <span className="product-card__badge">{product.discountRate}%</span>
          )}
          <WishlistHeart
            productId={product.id}
            size="lg"
            className="product-card__wish"
            loginRedirectPath={`/products/${product.id}`}
          />
        </div>
        <p className="product-card__brand">{product.brand}</p>
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__price">
          {product.hasDiscount && product.listPrice && (
            <span className="product-card__price-original">₩{product.listPrice}</span>
          )}
          <span>₩{product.price}</span>
        </p>
      </Link>
    </article>
  )
}

export default ProductCard
