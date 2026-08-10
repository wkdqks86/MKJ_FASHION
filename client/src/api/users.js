import apiClient from './client'

/**
 * User 스키마(createUser)에 맞춰 회원가입 요청
 * POST /api/users → userController.createUser → User.create
 */
export const signUpUser = async ({ name, email, password, phone }) => {
  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    user_type: 'customer',
  }

  if (phone) {
    payload.phone = phone
  }

  const { data } = await apiClient.post('/users', payload)
  return data
}

export const getUsers = async () => {
  const { data } = await apiClient.get('/users')
  return data
}

export const getUserById = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`)
  return data
}

export const updateUser = async (id, userData) => {
  const { data } = await apiClient.put(`/users/${id}`, userData)
  return data
}

export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/users/${id}`)
  return data
}
