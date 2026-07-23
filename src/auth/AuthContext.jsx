import { useCallback, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'
import { restoreSession, setAccessToken } from '../api/client.js'
import { AuthContext } from './authContextCore.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let cancelled = false
    restoreSession()
      .then((data) => {
        if (cancelled) return
        setUser(data.user)
      })
      .catch(() => {
        if (cancelled) return
        setAccessToken(null)
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setInitializing(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (input) => {
    const data = await authApi.login(input)
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.user
  }, [])

  const signup = useCallback(async (input) => {
    const data = await authApi.signup(input)
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, initializing, login, signup, logout }}>{children}</AuthContext.Provider>
  )
}
