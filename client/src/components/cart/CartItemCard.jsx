import { Link } from 'react-router-dom'
import { formatCategoryLabel } from '@/constants/productCategories'
import { getStockForSize, isShoeCategory } from '@/utils/productStock'

function formatPrice(value) {
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`
}

function formatSizeLabel(size, categoryType) {
  if (!size) return '-'
  return isShoeCategory(categoryType) ? `${size}mm` : size
}

function CartItemCard({
  item,
  isSelected,
  isUpdating,
  onToggleSelect,
  onQuantityChange,
  onRemove,
}) {
  const { product, quantity, size, unitPrice, lineTotal } = item
  const brand = formatCategoryLabel(product.gender, product.categoryType)
  const sizeLabel = formatSizeLabel(size, product.categoryType)
  const maxQuantity = getStockForSize(product, size)

  const decreaseQuantity = () => {
    if (quantity <= 1 || isUpdating) return
    onQuantityChange(item._id, quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity >= maxQuantity || isUpdating) return
    onQuantityChange(item._id, quantity + 1)
  }

  return (
    <article className="cart-item">
      <label className="cart-item__select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item._id)}
          aria-label={`${product.name} 선택`}
        />
      </label>

      <Link to={`/products/${product._id}`} className="cart-item__thumb-wrap">
        <img src={product.image} alt={product.name} className="cart-item__thumb" />
      </Link>

      <div className="cart-item__info">
        <p className="cart-item__brand">{brand}</p>
        <Link to={`/products/${product._id}`} className="cart-item__name">
          {product.name}
        </Link>
        <p className="cart-item__option">
          {sizeLabel} | {quantity}개
        </p>
        <p className="cart-item__price">{formatPrice(lineTotal)}</p>
        {maxQuantity < quantity && (
          <p className="cart-item__stock-warning" role="alert">
            재고 {maxQuantity}개 — 수량을 조정해 주세요.
          </p>
        )}
      </div>

      <div className="cart-item__actions">
        <div className="cart-item__quantity">
          <button
            type="button"
            className="cart-item__quantity-btn"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isUpdating}
            aria-label="수량 감소"
          >
            −
          </button>
          <span className="cart-item__quantity-value">{quantity}</span>
          <button
            type="button"
            className="cart-item__quantity-btn"
            onClick={increaseQuantity}
            disabled={quantity >= maxQuantity || isUpdating}
            aria-label="수량 증가"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="cart-item__remove-btn"
          onClick={() => onRemove(item._id)}
          disabled={isUpdating}
        >
          삭제
        </button>
      </div>

      <div className="cart-item__unit-price">{formatPrice(unitPrice)}</div>
    </article>
  )
}

export default CartItemCard
