import { useCallback, useEffect, useState } from 'react'
import {
  createStyleEdit,
  deleteStyleEdit,
  getActiveStyleEdit,
  getStyleEditById,
  getStyleEdits,
  updateStyleEdit,
} from '@/api/styleEdits'

export function useHomeStyleEdit() {
  const [styleEdit, setStyleEdit] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getActiveStyleEdit()
        if (!cancelled) setStyleEdit(data.styleEdit)
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'THE EDIT 콘텐츠를 불러오지 못했습니다.')
          setStyleEdit(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { styleEdit, isLoading, error }
}

export function useAdminStyleEdits() {
  const [styleEdits, setStyleEdits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStyleEdits = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getStyleEdits()
      setStyleEdits(data.styleEdits || [])
    } catch (err) {
      setError(err.response?.data?.message || 'THE EDIT 목록을 불러오지 못했습니다.')
      setStyleEdits([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStyleEdits()
  }, [loadStyleEdits])

  const removeStyleEdit = async (id) => {
    await deleteStyleEdit(id)
    setStyleEdits((prev) => prev.filter((item) => item._id !== id))
  }

  const toggleDisplayed = async (id, isDisplayed) => {
    try {
      const data = await updateStyleEdit(id, { isDisplayed: !isDisplayed })
      setStyleEdits((prev) =>
        prev.map((item) => (item._id === id ? data.styleEdit : item))
      )
    } catch (err) {
      throw new Error(err.response?.data?.message || '노출 상태 변경에 실패했습니다.')
    }
  }

  return { styleEdits, isLoading, error, reload: loadStyleEdits, removeStyleEdit, toggleDisplayed }
}

export function useStyleEditForm(styleEditId) {
  const isEditMode = Boolean(styleEditId)
  const [initialLoaded, setInitialLoaded] = useState(isEditMode ? null : undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const load = async () => {
      setError('')
      try {
        const data = await getStyleEditById(styleEditId)
        if (!cancelled) {
          setInitialLoaded(data.styleEdit)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'THE EDIT 정보를 불러오지 못했습니다.')
          setInitialLoaded(null)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isEditMode, styleEditId])

  const submitStyleEdit = async (formData) => {
    setIsSubmitting(true)
    setError('')

    const payload = {
      title: formData.title.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      images: formData.images,
      coverImageUrl: formData.coverImageUrl,
    }

    try {
      const data = isEditMode
        ? await updateStyleEdit(styleEditId, payload)
        : await createStyleEdit(payload)
      return data.styleEdit
    } catch (err) {
      const message = err.response?.data?.message || 'THE EDIT 저장에 실패했습니다.'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    initialData: initialLoaded,
    isEditMode,
    isSubmitting,
    error,
    setError,
    submitStyleEdit,
  }
}
