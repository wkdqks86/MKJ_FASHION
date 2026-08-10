import { Link, useParams } from 'react-router-dom'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import ProductDetailGallery from '@/components/product/ProductDetailGallery'
import ProductDetailInfo from '@/components/product/ProductDetailInfo'
import {
  CATEGORY_TYPE_LABELS,
  GENDER_LABELS,
} from '@/constants/productCategories'
import { useProductDetail } from '@/hooks/useProductDetail'
import './ProductDetailPage.css'

function ProductDetailPage() {
  const { id } = useParams()
  const { product, isLoading, error } = useProductDetail(id)

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <p className="product-detail-page__status">상품 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <PageBreadcrumb
          className="product-detail-page__breadcrumb"
          items={[
            { label: 'HOME', to: '/' },
            { label: '상품' },
          ]}
        />
        <p className="product-detail-page__status product-detail-page__status--error" role="alert">
          {error || '상품을 찾을 수 없습니다.'}
        </p>
        <Link to="/" className="product-detail-page__back-link">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const genderLabel = GENDER_LABELS[product.gender] || product.gender
  const categoryLabel = CATEGORY_TYPE_LABELS[product.categoryType] || product.categoryType

  return (
    <div className="product-detail-page">
      <PageBreadcrumb
        className="product-detail-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: genderLabel },
          { label: categoryLabel },
          { label: product.name },
        ]}
      />

      <div className="product-detail-page__layout">
        <ProductDetailGallery images={[product.image]} productName={product.name} />
        <ProductDetailInfo product={product} />
      </div>
    </div>
  )
}

export default ProductDetailPage
