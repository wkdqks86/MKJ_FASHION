import { Link } from 'react-router-dom'
import AdminIconButton from '@/components/admin/common/AdminIconButton'
import AdminDisplayToggle from '@/components/admin/common/AdminDisplayToggle'
import { formatDateRange } from '@/constants/styleEdits'

function StyleEditListPanel({ styleEdits, isLoading, error, onDelete, onToggleDisplay }) {
  if (isLoading) {
    return <p className="admin-loading">THE EDIT 목록을 불러오는 중...</p>
  }

  if (error) {
    return <p className="admin-form-error">{error}</p>
  }

  return (
    <div className="admin-card">
      <div className="admin-table-wrap">
        <table className="admin-table admin-table--style-edits">
          <colgroup>
            <col className="admin-table__col-thumb" />
            <col />
            <col className="admin-table__col-period" />
            <col className="admin-table__col-count" />
            <col className="admin-table__col-display" />
            <col className="admin-table__col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>대표 이미지</th>
              <th>제목</th>
              <th>노출 기간</th>
              <th>사진 수</th>
              <th>노출</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {styleEdits.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                  등록된 THE EDIT 콘텐츠가 없습니다.
                </td>
              </tr>
            ) : (
              styleEdits.map((item) => {
                const isDisplayed = item.isDisplayed !== false

                return (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="admin-table__thumb admin-table__thumb--cover"
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{formatDateRange(item.startDate, item.endDate)}</td>
                    <td>{item.images?.length || 0}장</td>
                    <td className="admin-table__cell--display">
                      <div className="admin-table__display-inner">
                        <AdminDisplayToggle
                          displayed={isDisplayed}
                          onToggle={() => onToggleDisplay(item)}
                          ariaLabelOn="노출 중"
                          ariaLabelOff="노출 안함"
                        />
                        <span className="admin-table__display-label">
                          {isDisplayed ? '노출함' : '노출안함'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <AdminIconButton
                          as={Link}
                          to={`/admin/style-edits/${item._id}/edit`}
                          variant="edit"
                          label="수정"
                        />
                        <AdminIconButton
                          variant="delete"
                          label="삭제"
                          onClick={() => onDelete(item)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StyleEditListPanel
