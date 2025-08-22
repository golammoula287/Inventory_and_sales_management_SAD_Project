import api from './apiClient.js'

// Expect backend endpoint: POST /api/auth/login -> { token, user }
export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  const token = res.data?.token || res.data?.accessToken
  const user = res.data?.user || null
  if (!token) throw new Error('No token returned from server')
  return { token, user }
}
