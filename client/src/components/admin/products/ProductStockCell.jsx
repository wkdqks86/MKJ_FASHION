import {
  getProductSizes,
  getTotalStock,
  isShoeCategory,
  normalizeStockBySize,
} from '@/utils/productStock'

function ProductStockCell({ product }) {
  const stockBySize = normalizeStockBySize(product)
  const sizes = getProductSizes(product.gender, product.categoryType)
  const isShoe = isShoeCategory(product.categoryType)
  const total = getTotalStock(stockBySize)

  if (total === 0) {
    return <span className="admin-table__stock admin-table__stock--empty">품절</span>
  }

  return (
    <div className="admin-table__stock">
      <strong className="admin-table__stock-total">합계 {total}</strong>
      <ul className="admin-table__stock-list">
        {sizes.map((size) => {
          const quantity = stockBySize[size] ?? 0
          const label = isShoe ? `${size}mm` : size

          return (
            <li
              key={size}
              className={`admin-table__stock-item${quantity === 0 ? ' admin-table__stock-item--empty' : ''}`}
            >
              <span>{label}</span>
              <span>{quantity}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProductStockCell
