import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './ChatToast.css'

const CARD_DURATION = 5000
const CARD_INTERVAL = 45000
const EXIT_ANIMATION_MS = 400

const BASE_MESSAGES = [
  {
    id: 'sale',
    text: '오늘은 CLEARANCE SALE 상품을 최대 70% 할인 중이에요.',
    emoji: '🏷️',
  },
  {
    id: 'new-arrival',
    text: '이번 주 MKJ STUDIO 신상품이 방금 입고됐어요.',
    emoji: '✨',
  },
  {
    id: 'coupon',
    text: '회원 전용 10% 쿠폰이 발급됐어요. 지금 확인해 보세요.',
    emoji: '🎁',
  },
  {
    id: 'recommend',
    text: '오늘의 추천: 린넨 셔츠와 와이드 팬츠, 어떠세요?',
    emoji: '👗',
  },
  {
    id: 'wishlist',
    text: '위시리스트에 담아두신 상품이 곧 품절될 예정이에요.',
    emoji: '💝',
  },
  {
    id: 'browse',
    text: '오늘은 어떤 스타일을 찾고 계신가요?',
    emoji: '👀',
  },
]

function buildMessages(userName) {
  const messages = []

  if (userName) {
    messages.push({
      id: 'welcome',
      text: `${userName}님, 반갑습니다!`,
      emoji: '👋',
    })
    messages.push({
      id: 'repurchase',
      text: '전에 구매하신 오버핏 코튼 셔츠, 잘 입고 계신가요?',
      emoji: '🛍️',
    })
    messages.push({
      id: 'review',
      text: '구매하신 상품은 만족스러우셨나요? 리뷰를 남겨주세요.',
      emoji: '⭐',
    })
  }

  return [...messages, ...BASE_MESSAGES]
}

function ChatToast({ userName }) {
  const [currentMessage, setCurrentMessage] = useState(null)
  const [phase, setPhase] = useState('hidden')
  const indexRef = useRef(0)
  const timersRef = useRef([])

  const messages = useMemo(() => buildMessages(userName), [userName])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const addTimer = (fn, delay) => {
    const id = setTimeout(fn, delay)
    timersRef.current.push(id)
    return id
  }

  const showMessage = useCallback((message) => {
    setCurrentMessage(message)
    setPhase('enter')

    addTimer(() => setPhase('visible'), 20)
    addTimer(() => setPhase('exit'), CARD_DURATION)
    addTimer(() => {
      setPhase('hidden')
      setCurrentMessage(null)
    }, CARD_DURATION + EXIT_ANIMATION_MS)
  }, [])

  useEffect(() => {
    if (messages.length === 0) return

    clearTimers()
    indexRef.current = 0
    showMessage(messages[0])

    const intervalId = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % messages.length
      showMessage(messages[indexRef.current])
    }, CARD_INTERVAL)

    return () => {
      clearInterval(intervalId)
      clearTimers()
    }
  }, [messages, showMessage])

  if (!currentMessage) return null

  return (
    <div
      className={`chat-toast chat-toast--${phase}`}
      role="status"
      aria-live="polite"
    >
      <div className="chat-toast__avatar" aria-hidden="true">
        {currentMessage.emoji}
      </div>
      <div className="chat-toast__bubble">
        <p className="chat-toast__label">MKJ FASHION</p>
        <p className="chat-toast__text">{currentMessage.text}</p>
      </div>
    </div>
  )
}

export default ChatToast
export { CARD_DURATION, CARD_INTERVAL }
