import { useCloudinaryWidget } from '@/hooks/useCloudinaryWidget'

function CloudinaryMultiImageUpload({
  images,
  coverImageUrl,
  onImagesChange,
  onCoverChange,
  onClearError,
}) {
  const appendImages = (urls) => {
    const merged = [...images]
    urls.forEach((url) => {
      if (!merged.includes(url)) merged.push(url)
    })
    onImagesChange(merged)
    if (!coverImageUrl && merged.length > 0) {
      onCoverChange(merged[0])
    }
    onClearError?.()
  }

  const { openWidget, isReady, isConfigured, loadError } = useCloudinaryWidget({
    folder: 'mkj-style-edits',
    multiple: true,
    maxFiles: 10,
    croppingAspectRatio: 0.75,
    onSuccess: (url) => appendImages([url]),
    onBatchSuccess: (urls) => appendImages(urls),
  })

  const handleRemove = (url) => {
    const next = images.filter((item) => item !== url)
    onImagesChange(next)
    if (coverImageUrl === url) {
      onCoverChange(next[0] || '')
    }
  }

  if (!isConfigured) {
    return (
      <div className="admin-image-upload">
        <p className="admin-form-hint admin-form-hint--warn">
          Cloudinary가 설정되지 않았습니다. client/.env에 Cloudinary 환경 변수를 추가해 주세요.
        </p>
        <textarea
          className="admin-input"
          rows={4}
          placeholder="https://... (줄바꿈으로 여러 URL 입력)"
          value={images.join('\n')}
          onChange={(e) => {
            const urls = e.target.value.split('\n').map((line) => line.trim()).filter(Boolean)
            onImagesChange(urls)
            if (!coverImageUrl && urls[0]) onCoverChange(urls[0])
          }}
        />
      </div>
    )
  }

  return (
    <div className="admin-image-upload">
      {loadError && (
        <p className="admin-form-error admin-form-error--inline">{loadError}</p>
      )}

      {images.length > 0 && (
        <div className="admin-image-grid">
          {images.map((url) => {
            const isCover = coverImageUrl === url
            return (
              <div key={url} className={`admin-image-grid__item${isCover ? ' admin-image-grid__item--cover' : ''}`}>
                <img src={url} alt="THE EDIT" className="admin-image-grid__thumb" />
                {isCover && <span className="admin-image-grid__badge">대표</span>}
                <div className="admin-image-grid__actions">
                  {!isCover && (
                    <button
                      type="button"
                      className="admin-btn admin-btn--outline admin-btn--sm"
                      onClick={() => onCoverChange(url)}
                    >
                      대표 지정
                    </button>
                  )}
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline admin-btn--sm"
                    onClick={() => handleRemove(url)}
                  >
                    제거
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button
        type="button"
        className="admin-upload-zone admin-upload-zone--clickable"
        onClick={openWidget}
        disabled={!isReady}
      >
        <span className="admin-upload-zone__icon" aria-hidden="true">📷</span>
        <span>{isReady ? '클릭하여 사진 추가 업로드' : 'Cloudinary 위젯 준비 중...'}</span>
        <span className="admin-upload-zone__sub">JPG, PNG, WEBP · 최대 5MB · 여러 장 선택 가능</span>
      </button>
    </div>
  )
}

export default CloudinaryMultiImageUpload
