import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts } from '@/api/products'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import ProductCard from '@/components/product/ProductCard'
import { GENDER } from '@/constants/productCategories'
import { mapProductForHomeCard } from '@/utils/productDisplay'
import './HomePage.css'
import './ProductListPage.css'

const LIST_CONFIG = {
  all: {
    title: 'NEW',
    subtitle: '전체 상품',
    breadcrumb: '전체 상품',
  },
  men: {
    title: 'MEN',
    subtitle: '남성 상품',
    breadcrumb: '남성',
    gender: GENDER.MALE,
  },
  women: {
    title: 'WOMEN',
    subtitle: '여성 상품',
    breadcrumb: '여성',
    gender: GENDER.FEMALE,
  },
  sale: {
    title: 'SALE',
    subtitle: '할인 상품',
    breadcrumb: '할인',
    onSale: true,
  },
}

function filterProductsByQuery(products, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return products

  return products.filter((product) => {
    const name = product.name?.toLowerCase() ?? ''
    const sku = product.sku?.toLowerCase() ?? ''
    const description = product.description?.toLowerCase() ?? ''
    return (
      name.includes(normalized)
      || sku.includes(normalized)
      || description.includes(normalized)
    )
  })
}

function ProductListPage({ variant = 'all' }) {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')?.trim() ?? ''
  const config = LIST_CONFIG[variant] ?? LIST_CONFIG.all
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const params = { isDisplayed: true }
        if (config.gender) {
          params.gender = config.gender
        }

        const data = await getProducts(params)
        let list = data.products || []

        if (config.onSale) {
          list = list.filter(
            (product) => product.discountRate != null && product.salePrice != null,
          )
        }

        if (!cancelled) {
          setProducts(list)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || '상품을 불러오지 못했습니다.')
          setProducts([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [config.gender, config.onSale])

  const filteredProducts = useMemo(
    () => filterProductsByQuery(products, searchQuery),
    [products, searchQuery],
  )

  const cards = useMemo(
    () => filteredProducts.map(mapProductForHomeCard),
    [filteredProducts],
  )

  const pageTitle = searchQuery ? 'SEARCH' : config.title
  const pageSubtitle = searchQuery ? `"${searchQuery}" 검색 결과` : config.subtitle
  const breadcrumbLabel = searchQuery ? '검색' : config.breadcrumb

  return (
    <div className="product-list-page">
      <PageBreadcrumb
        className="product-list-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="product-list-page__inner">
        <header className="product-list-page__header">
          <h1 className="product-list-page__title">{pageTitle}</h1>
          <p className="product-list-page__subtitle">{pageSubtitle}</p>
          {!isLoading && !error && (
            <p className="product-list-page__count">{cards.length}개 상품</p>
          )}
        </header>

        {error && (
          <p className="product-list-page__status product-list-page__status--error" role="alert">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="product-list-page__status">상품을 불러오는 중...</p>
        )}

        {!isLoading && !error && cards.length === 0 && (
          <div className="product-list-page__empty">
            <p>{searchQuery ? '검색 결과가 없습니다.' : '표시할 상품이 없습니다.'}</p>
            <Link to="/" className="product-list-page__home-link">
              홈으로 돌아가기
            </Link>
          </div>
        )}

        {!isLoading && !error && cards.length > 0 && (
          <div className="product-list-page__grid">
            {cards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListPage
