import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'

const SLIDE_INTERVAL_MS = 5000
const SLIDE_TRANSITION_MS = 600

function EditCoverImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE)

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="eager"
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  )
}

function TheEditSection({ styleEdit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [enableTransition, setEnableTransition] = useState(true)
  const currentIndexRef = useRef(currentIndex)

  const slideImages = useMemo(() => {
    if (!styleEdit) return []

    const allImages = styleEdit.images?.map((item) => item.url) || []
    const carouselImages = styleEdit.carouselImages?.length
      ? styleEdit.carouselImages
      : allImages.filter((url) => url !== styleEdit.coverImageUrl)

    return carouselImages.length > 0 ? carouselImages : [styleEdit.coverImageUrl]
  }, [styleEdit])

  const loopSlides = useMemo(() => {
    if (slideImages.length <= 1) return slideImages
    return [...slideImages, slideImages[0]]
  }, [slideImages])

  const styleEditId = styleEdit?._id
  const canLoop = slideImages.length > 1

  currentIndexRef.current = currentIndex

  useEffect(() => {
    setCurrentIndex(0)
    setEnableTransition(true)
  }, [styleEditId])

  useEffect(() => {
    if (!canLoop) return undefined

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= slideImages.length) return prev
        return prev + 1
      })
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [canLoop, slideImages.length, styleEditId])

  const handleTransitionEnd = useCallback(() => {
    if (!canLoop || currentIndexRef.current !== slideImages.length) return

    setEnableTransition(false)
    setCurrentIndex(0)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnableTransition(true)
      })
    })
  }, [canLoop, slideImages.length])

  if (!styleEdit) return null

  return (
    <section className="section section--edit">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">THE EDIT</h2>
          <span className="section__subtitle">{styleEdit.title}</span>
        </div>

        <div className="the-edit-showcase">
          <div className="the-edit-showcase__cover">
            <EditCoverImage
              src={styleEdit.coverImageUrl}
              alt={styleEdit.title}
              className="the-edit-showcase__cover-img"
            />
            <div className="the-edit-showcase__cover-caption">
              <span className="the-edit-showcase__label">Featured Look</span>
              <h3>{styleEdit.title}</h3>
            </div>
          </div>

          <div className="the-edit-showcase__carousel-wrap">
            <div className="the-edit-showcase__carousel-viewport">
              <div
                className="the-edit-showcase__carousel-track"
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: enableTransition
                    ? `transform ${SLIDE_TRANSITION_MS}ms ease-in-out`
                    : 'none',
                }}
              >
                {loopSlides.map((url, index) => (
                  <article key={`${url}-${index}`} className="the-edit-showcase__slide">
                    <EditCoverImage
                      src={url}
                      alt={`${styleEdit.title} ${(index % slideImages.length) + 1}`}
                      className="the-edit-showcase__slide-img"
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TheEditSection
