import { Link } from 'react-router-dom'
import AdminPageHead from '@/components/admin/common/AdminPageHead'
import StyleEditListPanel from '@/components/admin/styleEdits/StyleEditListPanel'
import { useAdminStyleEdits } from '@/hooks/useStyleEdits'

function AdminStyleEditsPage() {
  const { styleEdits, isLoading, error, removeStyleEdit, toggleDisplayed } = useAdminStyleEdits()

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.title}" THE EDIT를 삭제하시겠습니까?`)) return
    try {
      await removeStyleEdit(item._id)
    } catch (err) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleToggleDisplay = async (item) => {
    try {
      await toggleDisplayed(item._id, item.isDisplayed !== false)
    } catch (err) {
      alert(err.message || '노출 상태 변경에 실패했습니다.')
    }
  }

  return (
    <>
      <AdminPageHead
        title="THE EDIT 관리"
        description={`스타일 연출 콘텐츠 (${styleEdits.length.toLocaleString()}개)`}
      />
      <div className="admin-product-toolbar" style={{ marginBottom: '1rem' }}>
        <div />
        <Link to="/admin/style-edits/new" className="admin-btn admin-btn--primary">
          + THE EDIT 등록
        </Link>
      </div>
      <StyleEditListPanel
        styleEdits={styleEdits}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        onToggleDisplay={handleToggleDisplay}
      />
    </>
  )
}

export default AdminStyleEditsPage
