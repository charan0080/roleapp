import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import client from '../api/client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    hydrateUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hydrateUser = async () => {
    const tokens = localStorage.getItem('coplur_tokens')
    if (!tokens) {
      setLoading(false)
      return
    }

    try {
      await fetchUserProfile()
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    const response = await client.get('api/accounts/profile/')
    setUser(response.data)
    return response.data
  }

  const login = async (username, password) => {
    const response = await client.post('api/token/', { username, password })
    const tokens = {
      accessToken: response.data.access,
      refreshToken: response.data.refresh,
    }
    localStorage.setItem('coplur_tokens', JSON.stringify(tokens))
    const profile = await fetchUserProfile()
    navigate(profile?.role === 'ADMIN' ? '/admin' : '/student', { replace: true })
  }

  const register = async (payload) => {
    await client.post('api/accounts/register/', payload)
  }

  const logout = () => {
    localStorage.removeItem('coplur_tokens')
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile: fetchUserProfile, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
