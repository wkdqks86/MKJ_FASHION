import AdminPageHead from '@/components/admin/common/AdminPageHead'
import ProductListPanel from '@/components/admin/products/ProductListPanel'
import { useAdminProducts } from '@/hooks/useAdminProducts'

function AdminProductsPage() {
  const productState = useAdminProducts()

  return (
    <>
      <AdminPageHead
        title="상품 관리"
        description={`전체 상품 목록 (${productState.products.length.toLocaleString()}개)`}
      />
      <ProductListPanel {...productState} />
    </>
  )
}

export default AdminProductsPage
