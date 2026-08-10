import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CATEGORY_TYPE_OPTIONS,
  GENDER_OPTIONS,
  productToForm,
} from '@/constants/productCategories'
import { migrateStockForm } from '@/utils/productStock'
import CloudinaryImageUpload from '@/components/admin/products/CloudinaryImageUpload'
import ProductStockBySizeFields from '@/components/admin/products/ProductStockBySizeFields'
import { useProductEdit } from '@/hooks/useAdminProducts'

function ProductEditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, isLoading, isSubmitting, error, setError, updateProductData } = useProductEdit(id)
  const [form, setForm] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (product) {
      setForm(productToForm(product))
    }
  }, [product])

  const handleChange = (field) => (e) => {
    setForm((prev) => {
      const next = { ...prev, [field]: e.target.value }

      if (field === 'gender' || field === 'categoryType') {
        next.stockBySize = migrateStockForm(prev.stockBySize, next.gender, next.categoryType)
      }

      return next
    })
    setError('')
    setSuccessMessage('')
  }

  const handleListPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setForm((prev) => ({ ...prev, listPrice: value }))
    setError('')
    setSuccessMessage('')
  }

  const handleImageChange = (url) => {
    setForm((prev) => ({ ...prev, image: url }))
    setError('')
    setSuccessMessage('')
  }

  const handleStockBySizeChange = (stockBySize) => {
    setForm((prev) => ({ ...prev, stockBySize }))
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')

    if (!form.image?.trim()) {
      setError('상품 이미지를 업로드해 주세요.')
      return
    }

    try {
      const updated = await updateProductData(form)
      setSuccessMessage(`상품 정보가 수정되었습니다. (${updated.sku})`)
      setTimeout(() => navigate('/admin/products'), 1000)
    } catch {
      // error state handled in hook
    }
  }

  if (isLoading) {
    return <p className="admin-loading">상품 정보를 불러오는 중...</p>
  }

  if (!product || !form) {
    return (
      <>
        <p className="admin-form-error">상품을 찾을 수 없습니다.</p>
        <button type="button" className="admin-btn admin-btn--outline" onClick={() => navigate('/admin/products')}>
          목록으로
        </button>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-card">
          <h3 className="admin-card__title">기본 정보</h3>

          <div className="admin-form-field">
            <label htmlFor="product-sku">상품 ID (SKU)</label>
            <input
              id="product-sku"
              value={product.sku}
              readOnly
              className="admin-input--readonly"
            />
            <p className="admin-form-hint">SKU는 등록 후 변경할 수 없습니다.</p>
          </div>

          <div className="admin-form-field">
            <label htmlFor="product-name">상품명 *</label>
            <input
              id="product-name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="상품명을 입력하세요"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="product-gender">성별 *</label>
            <select id="product-gender" value={form.gender} onChange={handleChange('gender')} required>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="product-category-type">품목 *</label>
            <select
              id="product-category-type"
              value={form.categoryType}
              onChange={handleChange('categoryType')}
              required
            >
              {CATEGORY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card__title">가격 · 이미지</h3>

          <div className="admin-form-field">
            <label htmlFor="list-price">정가 *</label>
            <input
              id="list-price"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.listPrice}
              onChange={handleListPriceChange}
              placeholder="99000"
              required
            />
            <p className="admin-form-hint">판매가는 상품 관리 화면에서 할인율로 일괄 적용합니다.</p>
          </div>

          <ProductStockBySizeFields
            key={`${form.gender}-${form.categoryType}`}
            gender={form.gender}
            categoryType={form.categoryType}
            stockBySize={form.stockBySize}
            onChange={handleStockBySizeChange}
          />

          <div className="admin-form-field">
            <label>상품 이미지 *</label>
            <CloudinaryImageUpload
              value={form.image}
              onChange={handleImageChange}
              onClearError={() => setError('')}
            />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '1.25rem' }}>
        <h3 className="admin-card__title">상세 설명 (선택)</h3>
        <div className="admin-form-field">
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            placeholder="상품 상세 설명을 입력하세요..."
            rows={6}
          />
        </div>
      </div>

      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {successMessage && <p className="admin-form-success" role="status">{successMessage}</p>}

      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn--outline" onClick={() => navigate('/admin/products')}>
          취소
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '변경 사항 저장'}
        </button>
      </div>
    </form>
  )
}

export default ProductEditForm
