import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CloudinaryMultiImageUpload from '@/components/admin/styleEdits/CloudinaryMultiImageUpload'
import { INITIAL_STYLE_EDIT_FORM, styleEditToForm } from '@/constants/styleEdits'
import { useStyleEditForm } from '@/hooks/useStyleEdits'

function StyleEditForm({ styleEditId }) {
  const navigate = useNavigate()
  const { initialData, isEditMode, isSubmitting, error, setError, submitStyleEdit } = useStyleEditForm(styleEditId)
  const [form, setForm] = useState(INITIAL_STYLE_EDIT_FORM)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (initialData && typeof initialData === 'object' && initialData._id) {
      setForm(styleEditToForm(initialData))
    }
  }, [initialData])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')

    if (!form.title.trim()) {
      setError('제목을 입력해 주세요.')
      return
    }
    if (!form.startDate || !form.endDate) {
      setError('노출 기간(시작일·종료일)을 선택해 주세요.')
      return
    }
    if (form.endDate < form.startDate) {
      setError('종료일은 시작일 이후여야 합니다.')
      return
    }
    if (form.images.length === 0) {
      setError('사진을 1장 이상 등록해 주세요.')
      return
    }
    if (!form.coverImageUrl) {
      setError('대표 이미지를 선택해 주세요.')
      return
    }

    try {
      await submitStyleEdit(form)
      setSuccessMessage(isEditMode ? 'THE EDIT가 수정되었습니다.' : 'THE EDIT가 등록되었습니다.')
      setTimeout(() => navigate('/admin/style-edits'), 900)
    } catch {
      // handled in hook
    }
  }

  if (isEditMode && initialData === null) {
    return (
      <>
        <p className="admin-form-error">THE EDIT 콘텐츠를 찾을 수 없습니다.</p>
        <button type="button" className="admin-btn admin-btn--outline" onClick={() => navigate('/admin/style-edits')}>
          목록으로
        </button>
      </>
    )
  }

  if (isEditMode && !initialData) {
    return <p className="admin-loading">THE EDIT 정보를 불러오는 중...</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-card">
          <h3 className="admin-card__title">기본 정보</h3>

          <div className="admin-form-field">
            <label htmlFor="style-edit-title">제목 *</label>
            <input
              id="style-edit-title"
              value={form.title}
              onChange={handleChange('title')}
              placeholder="예: Spring Minimal Look"
              required
            />
          </div>

          <div className="admin-form-field">
            <label>노출 기간 *</label>
            <div className="admin-date-range">
              <input
                type="date"
                value={form.startDate}
                onChange={handleChange('startDate')}
                aria-label="시작일"
                required
              />
              <span className="admin-date-range__sep">~</span>
              <input
                type="date"
                value={form.endDate}
                onChange={handleChange('endDate')}
                aria-label="종료일"
                required
              />
            </div>
            <p className="admin-form-hint">시작일 00:00 ~ 종료일 23:59 기준으로 메인에 노출됩니다.</p>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card__title">사진 *</h3>
          <div className="admin-form-field">
            <CloudinaryMultiImageUpload
              images={form.images}
              coverImageUrl={form.coverImageUrl}
              onImagesChange={(images) => {
                setForm((prev) => ({ ...prev, images }))
                setError('')
                setSuccessMessage('')
              }}
              onCoverChange={(coverImageUrl) => {
                setForm((prev) => ({ ...prev, coverImageUrl }))
                setError('')
                setSuccessMessage('')
              }}
              onClearError={() => setError('')}
            />
            <p className="admin-form-hint">대표 이미지는 메인 THE EDIT 왼쪽 고정 영역에 표시됩니다.</p>
          </div>
        </div>
      </div>

      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {successMessage && <p className="admin-form-success" role="status">{successMessage}</p>}

      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn--outline" onClick={() => navigate('/admin/style-edits')}>
          취소
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : isEditMode ? '변경 사항 저장' : 'THE EDIT 등록'}
        </button>
      </div>
    </form>
  )
}

export default StyleEditForm
