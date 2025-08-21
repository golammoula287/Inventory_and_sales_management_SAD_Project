import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getToken, setToken as saveToken, removeToken } from '../utils/storage.js'
import * as auth from '../services/authService.js'
import api from '../services/apiClient.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const t = getToken()
        if (t) {
          const res = await api.get('/api/auth/me')
          setUser(res.data?.user || null)
          setToken(t)
        } else {
          setUser(null)
        }
      } catch {
        removeToken()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = async (email, password) => {
    const { token, user } = await auth.login(email, password)
    saveToken(token)
    setToken(token)
    setUser(user || null)
    return user
  }

  const logout = () => {
    removeToken()
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({
    user, token, isAuthenticated: !!token, loading, login, logout
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
