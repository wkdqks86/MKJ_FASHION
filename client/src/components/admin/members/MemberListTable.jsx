import AdminIconButton from '@/components/admin/common/AdminIconButton'
import {
  formatDateTime,
  USER_TYPE_CLASS,
  USER_TYPE_LABELS,
} from '@/constants/adminData'

function MemberListTable({ members, onViewDetail, onDelete, deletingMemberId }) {
  return (
    <div className="admin-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="전체 선택" /></th>
              <th>이름</th>
              <th>이메일</th>
              <th>연락처</th>
              <th>가입일</th>
              <th>최근 로그인</th>
              <th>회원 유형</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id}>
                  <td><input type="checkbox" aria-label={`${member.name} 선택`} /></td>
                  <td>
                    <button
                      type="button"
                      className="admin-table__link"
                      onClick={() => onViewDetail(member)}
                    >
                      {member.name}
                    </button>
                  </td>
                  <td>{member.email}</td>
                  <td>{member.phone || '-'}</td>
                  <td>{formatDateTime(member.createdAt)}</td>
                  <td>{formatDateTime(member.lastLoginAt)}</td>
                  <td>
                    <span className={`admin-status ${USER_TYPE_CLASS[member.user_type] || ''}`}>
                      {USER_TYPE_LABELS[member.user_type] || member.user_type}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-status ${
                        member.isActive === false ? 'admin-status--ended' : 'admin-status--active'
                      }`}
                    >
                      {member.isActive === false ? '비활성' : '활성'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-order-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--outline admin-btn--sm"
                        onClick={() => onViewDetail(member)}
                      >
                        상세보기
                      </button>
                      <AdminIconButton
                        variant="delete"
                        label="삭제"
                        onClick={() => onDelete?.(member)}
                        disabled={deletingMemberId === member._id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button type="button" className="admin-pagination__btn" aria-label="이전">‹</button>
        <button type="button" className="admin-pagination__btn admin-pagination__btn--active">1</button>
        <button type="button" className="admin-pagination__btn" aria-label="다음">›</button>
      </div>
    </div>
  )
}

export default MemberListTable
