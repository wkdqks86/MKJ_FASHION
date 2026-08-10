import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { previewProductSku } from '@/api/products'
import {
  CATEGORY_TYPE_OPTIONS,
  GENDER_OPTIONS,
  INITIAL_PRODUCT_FORM,
} from '@/constants/productCategories'
import { migrateStockForm } from '@/utils/productStock'
import CloudinaryImageUpload from '@/components/admin/products/CloudinaryImageUpload'
import ProductStockBySizeFields from '@/components/admin/products/ProductStockBySizeFields'
import { useProductRegister } from '@/hooks/useAdminProducts'

function ProductRegisterForm() {
  const navigate = useNavigate()
  const { registerProduct, isSubmitting, error, setError } = useProductRegister()
  const [form, setForm] = useState(INITIAL_PRODUCT_FORM)
  const [previewSku, setPreviewSku] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const data = await previewProductSku({
          gender: form.gender,
          categoryType: form.categoryType,
        })
        setPreviewSku(data.previewSku || '')
      } catch {
        setPreviewSku('')
      }
    }
    fetchPreview()
  }, [form.gender, form.categoryType])

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
      const product = await registerProduct(form)
      setSuccessMessage(`상품이 등록되었습니다. (${product.sku})`)
      setTimeout(() => navigate('/admin/products'), 1000)
    } catch {
      // error state handled in hook
    }
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
              value={previewSku || '카테고리 선택 시 미리보기'}
              readOnly
              className="admin-input--readonly"
            />
            <p className="admin-form-hint">등록 시 서버에서 자동 발급됩니다.</p>
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
          {isSubmitting ? '등록 중...' : '상품 등록'}
        </button>
      </div>
    </form>
  )
}

export default ProductRegisterForm
