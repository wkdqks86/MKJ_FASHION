import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lookupGuestOrder } from '@/api/orders'
import { clearAuth, saveGuestSession } from '@/utils/authStorage'
import { getGuestErrorMessage } from '@/utils/loginErrors'

export function useGuestLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', orderNumber: '' })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const clearMessages = () => {
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setError('주문자명을 입력해 주세요.')
      return
    }
    if (!form.orderNumber.trim()) {
      setError('주문번호를 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const data = await lookupGuestOrder({
        name: form.name.trim(),
        orderNumber: form.orderNumber.trim(),
      })

      if (!data.success || !data.order) {
        setError('주문 조회 응답이 올바르지 않습니다.')
        return
      }

      clearAuth()
      saveGuestSession({
        name: form.name.trim(),
        orderNumber: form.orderNumber.trim(),
        order: data.order,
      })

      setSuccessMessage('주문 조회에 성공했습니다.')
      setTimeout(() => navigate('/'), 800)
    } catch (err) {
      setError(getGuestErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    error,
    successMessage,
    isSubmitting,
    handleChange,
    handleSubmit,
    clearMessages,
  }
}
