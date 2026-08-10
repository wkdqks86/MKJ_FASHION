import { useState } from 'react'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'

function ProductDetailGallery({ images, productName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [failedIndexes, setFailedIndexes] = useState({})

  const slides = images.length > 0 ? images : [FALLBACK_IMAGE]
  const canNavigate = slides.length > 1

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const getImageSrc = (index) => {
    if (failedIndexes[index]) return FALLBACK_IMAGE
    return slides[index]
  }

  return (
    <div className="product-detail-gallery">
      <div className="product-detail-gallery__viewport">
        <img
          src={getImageSrc(currentIndex)}
          alt={`${productName} ${currentIndex + 1}`}
          className="product-detail-gallery__image"
          onError={() => setFailedIndexes((prev) => ({ ...prev, [currentIndex]: true }))}
        />

        {canNavigate && (
          <>
            <button
              type="button"
              className="product-detail-gallery__nav product-detail-gallery__nav--prev"
              aria-label="이전 이미지"
              onClick={goPrev}
            >
              &lt;
            </button>
            <button
              type="button"
              className="product-detail-gallery__nav product-detail-gallery__nav--next"
              aria-label="다음 이미지"
              onClick={goNext}
            >
              &gt;
            </button>
          </>
        )}
      </div>

      {canNavigate && (
        <div className="product-detail-gallery__dots" role="tablist" aria-label="상품 이미지">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`이미지 ${index + 1}`}
              className={`product-detail-gallery__dot${index === currentIndex ? ' product-detail-gallery__dot--active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductDetailGallery
