import apiClient from './client'

export const getActiveStyleEdit = async () => {
  const { data } = await apiClient.get('/style-edits/active')
  return data
}

export const getStyleEdits = async () => {
  const { data } = await apiClient.get('/style-edits')
  return data
}

export const getStyleEditById = async (id) => {
  const { data } = await apiClient.get(`/style-edits/${id}`)
  return data
}

export const createStyleEdit = async (payload) => {
  const { data } = await apiClient.post('/style-edits', payload)
  return data
}

export const updateStyleEdit = async (id, payload) => {
  const { data } = await apiClient.patch(`/style-edits/${id}`, payload)
  return data
}

export const deleteStyleEdit = async (id) => {
  const { data } = await apiClient.delete(`/style-edits/${id}`)
  return data
}
