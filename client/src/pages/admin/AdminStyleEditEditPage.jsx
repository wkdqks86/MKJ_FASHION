import { useParams } from 'react-router-dom'
import AdminPageHead from '@/components/admin/common/AdminPageHead'
import StyleEditForm from '@/components/admin/styleEdits/StyleEditForm'

function AdminStyleEditEditPage() {
  const { id } = useParams()

  return (
    <>
      <AdminPageHead
        breadcrumb={<>Home &gt; THE EDIT &gt; 수정</>}
        title="THE EDIT 수정"
        description="등록된 THE EDIT 콘텐츠를 수정합니다."
      />
      <StyleEditForm styleEditId={id} />
    </>
  )
}

export default AdminStyleEditEditPage
