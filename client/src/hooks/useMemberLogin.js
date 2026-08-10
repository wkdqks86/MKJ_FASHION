import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginUser } from '@/api/auth'
import {
  clearGuestSession,
  clearSavedEmail,
  getSavedEmail,
  saveAuth,
  saveEmail,
} from '@/utils/authStorage'
import { getLoginErrorMessage } from '@/utils/loginErrors'

export function useMemberLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '', saveEmail: false })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedEmail = getSavedEmail()
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail, saveEmail: true }))
    }
  }, [])

  const handleChange = (field) => (e) => {
    const value = field === 'saveEmail' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const clearMessages = () => {
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email.trim()) {
      setError('이메일을 입력해 주세요.')
      return
    }
    if (!form.password) {
      setError('비밀번호를 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      })

      if (!data.success || !data.accessToken || !data.refreshToken || !data.user) {
        setError('로그인 응답이 올바르지 않습니다.')
        return
      }

      if (form.saveEmail) {
        saveEmail(form.email.trim())
      } else {
        clearSavedEmail()
      }

      clearGuestSession()
      saveAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      })

      setSuccessMessage(`${data.user.name}님, 환영합니다!`)
      const redirectPath = searchParams.get('redirect')
      const nextPath = redirectPath?.startsWith('/') ? redirectPath : '/'
      setTimeout(() => navigate(nextPath), 800)
    } catch (err) {
      setError(getLoginErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    showPassword,
    error,
    successMessage,
    isSubmitting,
    handleChange,
    togglePassword: () => setShowPassword((prev) => !prev),
    handleSubmit,
    clearMessages,
  }
}
