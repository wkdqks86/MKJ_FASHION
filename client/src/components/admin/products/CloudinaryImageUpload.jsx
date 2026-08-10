import { useCloudinaryWidget } from '@/hooks/useCloudinaryWidget'

function CloudinaryImageUpload({ value, onChange, onClearError }) {
  const { openWidget, isReady, isConfigured, loadError } = useCloudinaryWidget({
    onSuccess: (url) => {
      onChange(url)
      onClearError?.()
    },
  })

  const handleRemove = () => {
    onChange('')
  }

  if (!isConfigured) {
    return (
      <div className="admin-image-upload">
        <p className="admin-form-hint admin-form-hint--warn">
          Cloudinary가 설정되지 않았습니다. client/.env에{' '}
          <code>VITE_CLOUDINARY_CLOUD_NAME</code>, <code>VITE_CLOUDINARY_UPLOAD_PRESET</code>를
          추가해 주세요.
        </p>
        <input
          type="url"
          className="admin-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... (임시 URL 입력)"
        />
        {value && (
          <img src={value} alt="상품 미리보기" className="admin-image-upload__preview" />
        )}
      </div>
    )
  }

  return (
    <div className="admin-image-upload">
      {loadError && (
        <p className="admin-form-error admin-form-error--inline">{loadError}</p>
      )}

      {value ? (
        <div className="admin-image-upload__preview-wrap">
          <img src={value} alt="상품 미리보기" className="admin-image-upload__preview" />
          <p className="admin-image-upload__url" title={value}>{value}</p>
          <div className="admin-image-upload__actions">
            <button
              type="button"
              className="admin-btn admin-btn--outline admin-btn--sm"
              onClick={openWidget}
              disabled={!isReady}
            >
              이미지 변경
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline admin-btn--sm"
              onClick={handleRemove}
            >
              제거
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="admin-upload-zone admin-upload-zone--clickable"
          onClick={openWidget}
          disabled={!isReady}
        >
          <span className="admin-upload-zone__icon" aria-hidden="true">📷</span>
          <span>{isReady ? '클릭하여 이미지 업로드' : 'Cloudinary 위젯 준비 중...'}</span>
          <span className="admin-upload-zone__sub">JPG, PNG, WEBP · 최대 5MB</span>
        </button>
      )}
    </div>
  )
}

export default CloudinaryImageUpload
