import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpUser } from '@/api/users'
import { INITIAL_AGREEMENTS, INITIAL_SIGNUP_FORM } from '@/constants/signUp'
import { getSignUpErrorMessage } from '@/utils/signUpErrors'
import { buildPhoneNumber, validateSignUpForm } from '@/utils/signUpValidation'

export function useSignUpForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_SIGNUP_FORM)
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleAgreementChange = (field) => (e) => {
    const checked = e.target.checked

    if (field === 'all') {
      setAgreements({
        all: checked,
        terms: checked,
        privacy: checked,
        marketing: checked,
        event: checked,
      })
      return
    }

    setAgreements((prev) => {
      const next = { ...prev, [field]: checked }
      next.all = next.terms && next.privacy && next.marketing && next.event
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateSignUpForm(form, agreements)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await signUpUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: buildPhoneNumber(form),
      })

      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(getSignUpErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    agreements,
    error,
    isSubmitting,
    success,
    handleChange,
    handleAgreementChange,
    handleSubmit,
  }
}
