import AdminPageHead from '@/components/admin/common/AdminPageHead'
import StyleEditForm from '@/components/admin/styleEdits/StyleEditForm'

function AdminStyleEditRegisterPage() {
  return (
    <>
      <AdminPageHead
        breadcrumb={<>Home &gt; THE EDIT &gt; 등록</>}
        title="THE EDIT 등록"
        description="메인 페이지 THE EDIT 섹션에 노출할 스타일 연출 콘텐츠를 등록합니다."
      />
      <StyleEditForm />
    </>
  )
}

export default AdminStyleEditRegisterPage
