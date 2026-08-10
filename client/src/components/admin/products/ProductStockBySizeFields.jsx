import { getProductSizes, isShoeCategory } from '@/utils/productStock'

function ProductStockBySizeFields({ gender, categoryType, stockBySize, onChange }) {
  const sizes = getProductSizes(gender, categoryType)
  const isShoe = isShoeCategory(categoryType)

  const handleChange = (size) => (event) => {
    const value = event.target.value.replace(/\D/g, '')
    onChange({
      ...stockBySize,
      [size]: value,
    })
  }

  return (
    <div className="admin-form-field">
      <span className="admin-form-field__label">재고 (선택)</span>
      <div className={`admin-stock-grid${isShoe ? ' admin-stock-grid--shoes' : ''}`}>
        {sizes.map((size) => (
          <div key={size} className="admin-stock-grid__item">
            <label htmlFor={`product-stock-${size}`}>
              {isShoe ? `${size}mm` : size}
            </label>
            <input
              id={`product-stock-${size}`}
              type="text"
              inputMode="numeric"
              value={stockBySize[size] ?? ''}
              onChange={handleChange(size)}
              placeholder="0"
            />
          </div>
        ))}
      </div>
      <p className="admin-form-hint">
        {isShoe
          ? '신발은 mm 단위 사이즈별 재고를 입력하세요. 비워두면 0으로 저장됩니다.'
          : '사이즈별 재고를 입력하세요. 비워두면 0으로 저장됩니다.'}
      </p>
    </div>
  )
}

export default ProductStockBySizeFields
