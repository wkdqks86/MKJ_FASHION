import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CATEGORY_TYPE_LABELS,
  formatCategoryLabel,
  GENDER_LABELS,
  getDisplaySalePrice,
} from '@/constants/productCategories'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useBuyNow } from '@/hooks/useBuyNow'
import WishlistHeart from '@/components/product/WishlistHeart'
import {
  getProductSizes,
  getStockForSize,
  getTotalStock,
  isShoeCategory,
  normalizeStockBySize,
} from '@/utils/productStock'

function ProductDetailInfo({ product }) {
  const { addToCart, isAdding, message: cartMessage, error: cartError } = useAddToCart()
  const { buyNow, isBuying, error: buyNowError } = useBuyNow()
  const [selectedSize, setSelectedSize] = useState('')
  const sizes = useMemo(
    () => getProductSizes(product.gender, product.categoryType),
    [product.gender, product.categoryType]
  )
  const isShoe = isShoeCategory(product.categoryType)
  const stockBySize = useMemo(() => normalizeStockBySize(product), [product])
  const maxQuantity = selectedSize ? getStockForSize(product, selectedSize) : 0
  const totalStock = getTotalStock(stockBySize)
  const [quantity, setQuantity] = useState(1)

  const salePrice = getDisplaySalePrice(product)
  const hasDiscount = product.salePrice != null && product.salePrice < product.listPrice
  const memberPrice = hasDiscount
    ? Math.round(salePrice * 0.9)
    : Math.round(product.listPrice * 0.9)

  const genderLabel = GENDER_LABELS[product.gender] || product.gender
  const categoryLabel = CATEGORY_TYPE_LABELS[product.categoryType] || product.categoryType

  useEffect(() => {
    if (!selectedSize) {
      setQuantity(0)
      return
    }

    const sizeStock = getStockForSize(product, selectedSize)
    setQuantity(sizeStock > 0 ? 1 : 0)
  }, [selectedSize, product])

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1))
  }

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value)
    if (Number.isNaN(value)) return

    if (value < 1) {
      setQuantity(1)
      return
    }

    if (value > maxQuantity) {
      setQuantity(maxQuantity)
      return
    }

    setQuantity(value)
  }

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value)
  }

  const canPurchase = selectedSize && maxQuantity > 0

  const handleAddToCart = async () => {
    if (!canPurchase || isAdding) return

    await addToCart({
      productId: product._id,
      quantity,
      size: selectedSize,
      loginRedirectPath: `/products/${product._id}`,
    })
  }

  const handleBuyNow = async () => {
    if (!canPurchase || isBuying || isAdding) return

    await buyNow({
      productId: product._id,
      quantity,
      size: selectedSize,
      loginRedirectPath: `/products/${product._id}`,
    })
  }

  const purchaseFeedback = buyNowError || cartError
  const purchaseMessage = !purchaseFeedback ? cartMessage : ''

  return (
    <div className="product-detail-info">
      <div className="product-detail-info__brand-row">
        <p className="product-detail-info__brand">
          MKJ FASHION · {genderLabel} &gt;
        </p>
      </div>

      <p className="product-detail-info__sku">{product.sku}</p>

      {hasDiscount && (
        <span className="product-detail-info__badge">CLEARANCE SALE</span>
      )}

      <div className="product-detail-info__title-row">
        <h1 className="product-detail-info__title">{product.name}</h1>
        <WishlistHeart
          productId={product._id}
          size="title"
          className="product-detail-info__wish"
          loginRedirectPath={`/products/${product._id}`}
          stopPropagation={false}
        />
      </div>

      <div className="product-detail-info__price-block">
        <p className="product-detail-info__price-current">
          {salePrice.toLocaleString('ko-KR')}
        </p>
        {hasDiscount && (
          <div className="product-detail-info__price-meta">
            <span className="product-detail-info__price-original">
              {product.listPrice.toLocaleString('ko-KR')}
            </span>
            <span className="product-detail-info__price-discount">
              {product.discountRate ?? Math.round((1 - salePrice / product.listPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="product-detail-info__member-price">
        <span className="product-detail-info__member-price-value">
          {memberPrice.toLocaleString('ko-KR')}
        </span>
        <span className="product-detail-info__member-price-label">회원/멤버십 쿠폰가</span>
        <button type="button" className="product-detail-info__coupon-btn">
          쿠폰다운로드
        </button>
      </div>

      <div className="product-detail-info__option">
        <span className="product-detail-info__option-label">카테고리</span>
        <p className="product-detail-info__option-value">
          {formatCategoryLabel(product.gender, product.categoryType)}
        </p>
      </div>

      <div className="product-detail-info__option">
        <label className="product-detail-info__option-label" htmlFor="product-size">
          사이즈
        </label>
        <select
          id="product-size"
          className="product-detail-info__select"
          value={selectedSize}
          onChange={handleSizeChange}
        >
          <option value="">사이즈를 선택하세요.</option>
          {sizes.map((size) => {
            const sizeStock = stockBySize[size] ?? 0
            const sizeLabel = isShoe ? `${size}mm` : size
            return (
              <option key={size} value={size} disabled={sizeStock === 0}>
                {sizeLabel}
                {sizeStock === 0 ? ' (품절)' : ` (재고 ${sizeStock}개)`}
              </option>
            )
          })}
        </select>
      </div>

      <div className="product-detail-info__option">
        <span className="product-detail-info__option-label">수량</span>
        {!selectedSize ? (
          <p className="product-detail-info__quantity-help">사이즈를 먼저 선택해 주세요.</p>
        ) : canPurchase ? (
          <>
            <div className="product-detail-info__quantity">
              <button
                type="button"
                className="product-detail-info__quantity-btn"
                aria-label="수량 줄이기"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                id="product-quantity"
                type="number"
                className="product-detail-info__quantity-input"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                aria-label="구매 수량"
              />
              <button
                type="button"
                className="product-detail-info__quantity-btn"
                aria-label="수량 늘리기"
                onClick={increaseQuantity}
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>
            <p className="product-detail-info__quantity-help">
              {isShoe ? `${selectedSize}mm` : selectedSize} 사이즈 최대 {maxQuantity}개까지 구매 가능합니다.
            </p>
          </>
        ) : (
          <p className="product-detail-info__quantity-soldout">선택하신 사이즈는 품절입니다.</p>
        )}
      </div>

      <div className="product-detail-info__actions">
        <button
          type="button"
          className="product-detail-info__btn product-detail-info__btn--cart"
          disabled={!canPurchase || isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? '담는 중...' : '장바구니'}
        </button>
        <button
          type="button"
          className="product-detail-info__btn product-detail-info__btn--buy"
          disabled={!canPurchase || isBuying || isAdding}
          onClick={handleBuyNow}
        >
          {isBuying ? '이동 중...' : '바로구매'}
        </button>
        {(purchaseMessage || purchaseFeedback) && (
          <p
            className={`product-detail-info__cart-feedback${
              purchaseFeedback ? ' product-detail-info__cart-feedback--error' : ' product-detail-info__cart-feedback--success'
            }`}
            role="status"
          >
            {purchaseFeedback || (
              <>
                {purchaseMessage}{' '}
                <Link to="/cart" className="product-detail-info__cart-link">
                  장바구니 보기
                </Link>
              </>
            )}
          </p>
        )}
      </div>

      <ul className="product-detail-info__meta">
        <li>
          <span>리뷰</span>
          <strong>0 Reviews</strong>
        </li>
        <li>
          <span>배송비</span>
          <strong>30,000원 이상 구매 시 무료</strong>
        </li>
        <li>
          <span>재고</span>
          <strong>
            {totalStock > 0
              ? sizes
                  .map((size) => `${isShoe ? `${size}mm` : size} ${stockBySize[size]}개`)
                  .join(' · ')
              : '품절'}
          </strong>
        </li>
        <li>
          <span>카테고리</span>
          <strong>
            {genderLabel} &gt; {categoryLabel}
          </strong>
        </li>
      </ul>

      {product.description && (
        <div className="product-detail-info__description">
          <h2>상품 설명</h2>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  )
}

export default ProductDetailInfo
