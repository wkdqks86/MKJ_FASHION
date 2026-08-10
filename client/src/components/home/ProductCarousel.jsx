import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'

const AUTO_PLAY_MS = 5000
const TRANSITION_MS = 600
const CAROUSEL_GAP_PX = 16
const MIN_CARD_WIDTH_PX = 180
const MAX_VISIBLE_COUNT = 5

function ProductCarousel({ products }) {
  const viewportRef = useRef(null)
  const [metrics, setMetrics] = useState({
    visibleCount: 4,
    stepPx: 0,
    cardWidthPx: 0,
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [enableTransition, setEnableTransition] = useState(true)
  const currentIndexRef = useRef(0)
  const autoPlayRef = useRef(null)

  const { visibleCount, stepPx, cardWidthPx } = metrics
  const canScroll = products.length > visibleCount

  const loopSlides = useMemo(() => {
    if (!canScroll) return products

    const head = products.slice(-visibleCount)
    const tail = products.slice(0, visibleCount)
    return [...head, ...products, ...tail]
  }, [products, visibleCount, canScroll])

  const startIndex = canScroll ? visibleCount : 0

  currentIndexRef.current = currentIndex

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const measure = () => {
      const viewportWidth = viewport.clientWidth
      if (viewportWidth <= 0) return

      let nextVisibleCount = 1

      for (let count = MAX_VISIBLE_COUNT; count >= 1; count -= 1) {
        const cardWidth = (viewportWidth - CAROUSEL_GAP_PX * (count - 1)) / count
        if (cardWidth >= MIN_CARD_WIDTH_PX || count === 1) {
          nextVisibleCount = count
          break
        }
      }

      nextVisibleCount = Math.min(nextVisibleCount, products.length, MAX_VISIBLE_COUNT)

      // 큰 화면에서도 슬라이드가 동작하도록 최소 1개는 숨김
      if (products.length > 1) {
        nextVisibleCount = Math.min(nextVisibleCount, products.length - 1)
      }

      const cardWidthPx = (viewportWidth - CAROUSEL_GAP_PX * (nextVisibleCount - 1)) / nextVisibleCount

      setMetrics({
        visibleCount: nextVisibleCount,
        cardWidthPx,
        stepPx: cardWidthPx + CAROUSEL_GAP_PX,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [products.length])

  useEffect(() => {
    setCurrentIndex(startIndex)
    setEnableTransition(true)
  }, [products, visibleCount, startIndex])

  const snapIfNeeded = useCallback(() => {
    if (!canScroll) return

    const index = currentIndexRef.current

    if (index >= products.length + visibleCount) {
      setEnableTransition(false)
      setCurrentIndex(visibleCount)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true))
      })
      return
    }

    if (index <= 0) {
      setEnableTransition(false)
      setCurrentIndex(products.length)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true))
      })
    }
  }, [canScroll, products.length, visibleCount])

  const goNext = useCallback(() => {
    if (!canScroll || stepPx <= 0) return
    setCurrentIndex((prev) => prev + 1)
  }, [canScroll, stepPx])

  const goPrev = useCallback(() => {
    if (!canScroll || stepPx <= 0) return
    setCurrentIndex((prev) => prev - 1)
  }, [canScroll, stepPx])

  const restartAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current)
    }

    if (!canScroll) return

    autoPlayRef.current = window.setInterval(goNext, AUTO_PLAY_MS)
  }, [canScroll, goNext])

  useEffect(() => {
    restartAutoPlay()
    return () => {
      if (autoPlayRef.current) {
        window.clearInterval(autoPlayRef.current)
      }
    }
  }, [restartAutoPlay, products, stepPx])

  const handlePrev = () => {
    goPrev()
    restartAutoPlay()
  }

  const handleNext = () => {
    goNext()
    restartAutoPlay()
  }

  const translateX = stepPx > 0 ? currentIndex * stepPx : 0

  return (
    <div
      className="product-carousel"
      onMouseEnter={() => {
        if (autoPlayRef.current) window.clearInterval(autoPlayRef.current)
      }}
      onMouseLeave={restartAutoPlay}
    >
      <button
        type="button"
        className="product-carousel__nav product-carousel__nav--prev"
        aria-label="이전 상품"
        onClick={handlePrev}
        disabled={!canScroll}
      >
        &lt;
      </button>

      <div ref={viewportRef} className="product-carousel__viewport">
        <div
          className="product-carousel__track"
          onTransitionEnd={snapIfNeeded}
          style={{
            transform: `translateX(-${translateX}px)`,
            transition: enableTransition ? `transform ${TRANSITION_MS}ms ease-in-out` : 'none',
            '--slide-width': cardWidthPx > 0 ? `${cardWidthPx}px` : undefined,
          }}
        >
          {loopSlides.map((product, index) => (
            <div key={`${product.id}-${index}`} className="product-carousel__slide">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="product-carousel__nav product-carousel__nav--next"
        aria-label="다음 상품"
        onClick={handleNext}
        disabled={!canScroll}
      >
        &gt;
      </button>
    </div>
  )
}

export default ProductCarousel
