import AdminPageHead from '@/components/admin/common/AdminPageHead'
import ProductEditForm from '@/components/admin/products/ProductEditForm'

function AdminProductEditPage() {
  return (
    <>
      <AdminPageHead
        breadcrumb={<>Home &gt; 상품 관리 &gt; 상품 수정</>}
        title="상품 수정"
        description="등록된 MKJ FASHION 상품 정보를 수정합니다."
      />
      <ProductEditForm />
    </>
  )
}

export default AdminProductEditPage
