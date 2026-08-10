import { useEffect, useState } from 'react'
import { deleteUser, updateUser } from '@/api/users'
import { formatDateTime, USER_TYPE_LABELS } from '@/constants/adminData'

function MemberDetailModal({ member, onClose, onUpdated, onDeleted }) {
  const [name, setName] = useState(member?.name || '')
  const [phone, setPhone] = useState(member?.phone || '')
  const [address, setAddress] = useState(member?.address || '')
  const [userType, setUserType] = useState(member?.user_type || 'customer')
  const [isActive, setIsActive] = useState(member?.isActive !== false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setName(member?.name || '')
    setPhone(member?.phone || '')
    setAddress(member?.address || '')
    setUserType(member?.user_type || 'customer')
    setIsActive(member?.isActive !== false)
    setError('')
  }, [member])

  if (!member) return null

  const handleSave = async () => {
    if (member._id?.startsWith('mock-')) {
      onClose()
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const data = await updateUser(member._id, {
        name: name.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        user_type: userType,
        isActive,
      })

      if (data.success) {
        onUpdated?.(data.user)
        onClose()
        return
      }

      setError('회원 정보를 저장하지 못했습니다.')
    } catch (err) {
      setError(err.response?.data?.message || '회원 정보를 저장하지 못했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (member._id?.startsWith('mock-')) {
      window.alert('샘플 데이터는 삭제할 수 없습니다.')
      return
    }

    const confirmed = window.confirm(
      `회원 ${member.name} (${member.email})을(를) 삭제하시겠습니까?\n삭제된 회원 정보는 복구할 수 없습니다.`,
    )

    if (!confirmed) return

    setIsDeleting(true)
    setError('')

    try {
      const data = await deleteUser(member._id)

      if (data.success) {
        onDeleted?.(member._id)
        onClose()
        return
      }

      setError('회원을 삭제하지 못했습니다.')
    } catch (err) {
      setError(err.response?.data?.message || '회원을 삭제하지 못했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="member-modal-title"
      >
        <div className="admin-modal__header">
          <h2 id="member-modal-title" className="admin-modal__title">
            회원 상세 [{member.name}]
          </h2>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="admin-modal__body">
          <div className="admin-info-grid">
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">이메일</div>
              <div className="admin-info-cell__value">{member.email}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">가입일</div>
              <div className="admin-info-cell__value">{formatDateTime(member.createdAt)}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">최근 로그인</div>
              <div className="admin-info-cell__value">{formatDateTime(member.lastLoginAt)}</div>
            </div>
          </div>

          <h3 className="admin-section-title">👤 회원 정보</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="member-name">이름</label>
              <input
                id="member-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="member-phone">연락처</label>
              <input
                id="member-phone"
                type="text"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="member-type">회원 유형</label>
              <select
                id="member-type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                {Object.entries(USER_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-field">
              <label htmlFor="member-active">계정 상태</label>
              <select
                id="member-active"
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
            <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="member-address">주소</label>
              <textarea
                id="member-address"
                rows={3}
                placeholder="배송지 주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="admin-form-error" role="alert">{error}</p>
          )}
        </div>

        <div className="admin-modal__footer">
          <button
            type="button"
            className="admin-btn admin-btn--danger admin-modal__footer-delete"
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? '삭제 중...' : '회원 삭제'}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={onClose}>
            닫기
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSave}
            disabled={isSaving || isDeleting}
          >
            {isSaving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MemberDetailModal
