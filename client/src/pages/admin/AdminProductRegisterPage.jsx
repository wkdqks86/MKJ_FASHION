import AdminPageHead from '@/components/admin/common/AdminPageHead'
import ProductRegisterForm from '@/components/admin/products/ProductRegisterForm'

function AdminProductRegisterPage() {
  return (
    <>
      <AdminPageHead
        breadcrumb={<>Home &gt; 상품 관리 &gt; 상품 등록</>}
        title="상품 등록"
        description="새로운 MKJ FASHION 상품을 등록합니다."
      />
      <ProductRegisterForm />
    </>
  )
}

export default AdminProductRegisterPage
