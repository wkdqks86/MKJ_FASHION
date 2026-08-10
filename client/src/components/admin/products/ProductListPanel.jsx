import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/constants/adminData'
import AdminIconButton from '@/components/admin/common/AdminIconButton'
import AdminDisplayToggle from '@/components/admin/common/AdminDisplayToggle'
import AdminSearchField from '@/components/admin/common/AdminSearchField'
import ProductStockCell from '@/components/admin/products/ProductStockCell'
import {
  CATEGORY_TYPE_OPTIONS,
  DISCOUNT_PERCENT_OPTIONS,
  formatCategoryLabel,
  GENDER_OPTIONS,
  getDisplaySalePrice,
} from '@/constants/productCategories'
import { getTotalStock, normalizeStockBySize } from '@/utils/productStock'

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20]

function BulkDiscountBar({ selectedCount, onApply, onClearDiscount, isApplying }) {
  const [discountPercent, setDiscountPercent] = useState(30)

  if (selectedCount === 0) return null

  return (
    <div className="admin-bulk-bar">
      <span className="admin-bulk-bar__count">{selectedCount}개 선택됨</span>
      <span className="admin-bulk-bar__label">할인율</span>
      <div className="admin-bulk-bar__options" role="group" aria-label="할인율 선택">
        {DISCOUNT_PERCENT_OPTIONS.map((percent) => (
          <button
            key={percent}
            type="button"
            className={`admin-bulk-bar__option${discountPercent === percent ? ' admin-bulk-bar__option--active' : ''}`}
            onClick={() => setDiscountPercent(percent)}
            disabled={isApplying}
            aria-pressed={discountPercent === percent}
          >
            {percent}%
          </button>
        ))}
      </div>
      <button
        type="button"
        className="admin-btn admin-btn--primary admin-btn--sm"
        disabled={isApplying}
        onClick={() => onApply(discountPercent)}
      >
        {isApplying ? '처리 중...' : '판매가 일괄 적용'}
      </button>
      <button
        type="button"
        className="admin-btn admin-btn--outline admin-btn--sm"
        disabled={isApplying}
        onClick={onClearDiscount}
      >
        할인 제거
      </button>
    </div>
  )
}

function ProductListTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onToggleDisplay,
  onDelete,
  actionError,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}) {
  const allSelected = products.length > 0 && products.every((product) => selectedIds.has(product._id))

  return (
    <div className="admin-card">
      {actionError && <p className="admin-form-error admin-form-error--inline">{actionError}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="전체 선택"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th>이미지</th>
              <th>상품 ID</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>정가</th>
              <th>판매가</th>
              <th>할인</th>
              <th>재고</th>
              <th>진열</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                  등록된 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`${product.name} 선택`}
                      checked={selectedIds.has(product._id)}
                      onChange={() => onToggleSelect(product._id)}
                    />
                  </td>
                  <td>
                    <img src={product.image} alt={product.name} className="admin-table__thumb" />
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{formatCategoryLabel(product.gender, product.categoryType)}</td>
                  <td>{formatPrice(product.listPrice)}</td>
                  <td>{formatPrice(getDisplaySalePrice(product))}</td>
                  <td>
                    {product.discountRate != null ? (
                      <span className="admin-status admin-status--shipped">{product.discountRate}%</span>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.75rem' }}>미적용</span>
                    )}
                  </td>
                  <td className="admin-table__cell--stock">
                    <ProductStockCell product={product} />
                  </td>
                  <td className="admin-table__cell--display">
                    <div className="admin-table__display-inner">
                      <AdminDisplayToggle
                        displayed={product.isDisplayed}
                        onToggle={() => onToggleDisplay(product)}
                      />
                      <span className="admin-table__display-label">
                        {product.isDisplayed ? '진열함' : '진열안함'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <AdminIconButton
                        as={Link}
                        to={`/admin/products/${product._id}/edit`}
                        variant="edit"
                        label="수정"
                      />
                      <AdminIconButton
                        variant="delete"
                        label="삭제"
                        onClick={() => onDelete(product)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalCount > 0 && (
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

function ProductPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="admin-pagination">
      <button
        type="button"
        className="admin-pagination__btn"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={`admin-pagination__btn${currentPage === page ? ' admin-pagination__btn--active' : ''}`}
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="admin-pagination__btn"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  )
}

function ProductFilterBar({ filters, onFilterChange, pageSize, onPageSizeChange }) {
  const [keywordInput, setKeywordInput] = useState(filters.keyword)

  useEffect(() => {
    setKeywordInput(filters.keyword)
  }, [filters.keyword])

  const handleKeywordSearch = () => {
    onFilterChange('keyword', keywordInput.trim())
  }

  return (
    <div className="admin-product-toolbar">
      <div className="admin-product-toolbar__filters">
        <select
          className="admin-input admin-input--page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="페이지당 표시 개수"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}개씩</option>
          ))}
        </select>
        <select
          className="admin-input"
          value={filters.gender}
          onChange={(e) => onFilterChange('gender', e.target.value)}
        >
          <option value="">전체 성별</option>
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="admin-input"
          value={filters.categoryType}
          onChange={(e) => onFilterChange('categoryType', e.target.value)}
        >
          <option value="">전체 품목</option>
          {CATEGORY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="admin-chip-group">
          {['전체', '진열함', '진열안함', '품절', '할인중'].map((f) => (
            <button
              key={f}
              type="button"
              className={`admin-chip${filters.displayFilter === f ? ' admin-chip--active' : ''}`}
              onClick={() => onFilterChange('displayFilter', f)}
            >
              {f}
            </button>
          ))}
        </div>
        <AdminSearchField
          variant="light"
          value={keywordInput}
          onChange={setKeywordInput}
          onSearch={handleKeywordSearch}
          placeholder="상품명, SKU 검색..."
          ariaLabel="상품명 또는 SKU 검색"
        />
      </div>
      <Link to="/admin/products/new" className="admin-btn admin-btn--primary">
        + 상품 등록
      </Link>
    </div>
  )
}

function filterProducts(products, filters) {
  let result = [...products]

  if (filters.gender) {
    result = result.filter((p) => p.gender === filters.gender)
  }
  if (filters.categoryType) {
    result = result.filter((p) => p.categoryType === filters.categoryType)
  }
  if (filters.displayFilter === '진열함') {
    result = result.filter((p) => p.isDisplayed)
  } else if (filters.displayFilter === '진열안함') {
    result = result.filter((p) => !p.isDisplayed)
  } else if (filters.displayFilter === '품절') {
    result = result.filter((p) => getTotalStock(normalizeStockBySize(p)) === 0)
  } else if (filters.displayFilter === '할인중') {
    result = result.filter((p) => p.discountRate != null && p.salePrice != null)
  }

  if (filters.keyword.trim()) {
    const q = filters.keyword.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    )
  }

  return result
}

function ProductListPanel({
  products,
  isLoading,
  error,
  toggleDisplayed,
  removeProduct,
  applyBulkDiscount,
  clearBulkDiscount,
}) {
  const [filters, setFilters] = useState({
    gender: '',
    categoryType: '',
    displayFilter: '전체',
    keyword: '',
  })
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [actionError, setActionError] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setSelectedIds(new Set())
  }

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleSelectAll = () => {
    const pageIds = paginatedProducts.map((p) => p._id)
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        pageIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        pageIds.forEach((id) => next.add(id))
        return next
      })
    }
  }

  const handleToggleDisplay = async (product) => {
    setActionError('')
    try {
      await toggleDisplayed(product._id, product.isDisplayed)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) return
    setActionError('')
    try {
      await removeProduct(product._id)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(product._id)
        return next
      })
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleBulkApply = async (discountPercent) => {
    setActionError('')
    setIsApplying(true)
    try {
      await applyBulkDiscount([...selectedIds], discountPercent)
      setSelectedIds(new Set())
    } catch (err) {
      setActionError(err.message)
    } finally {
      setIsApplying(false)
    }
  }

  const handleBulkClear = async () => {
    if (!window.confirm(`선택한 ${selectedIds.size}개 상품의 할인을 제거하시겠습니까?`)) return
    setActionError('')
    setIsApplying(true)
    try {
      await clearBulkDiscount([...selectedIds])
      setSelectedIds(new Set())
    } catch (err) {
      setActionError(err.message)
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return <p className="admin-loading">상품 목록을 불러오는 중...</p>
  }

  if (error) {
    return <p className="admin-form-error">{error}</p>
  }

  return (
    <>
      <ProductFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <BulkDiscountBar
        selectedCount={selectedIds.size}
        onApply={handleBulkApply}
        onClearDiscount={handleBulkClear}
        isApplying={isApplying}
      />
      <ProductListTable
        products={paginatedProducts}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleDisplay={handleToggleDisplay}
        onDelete={handleDelete}
        actionError={actionError}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredProducts.length}
      />
    </>
  )
}

export default ProductListPanel
