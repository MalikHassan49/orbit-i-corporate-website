import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On first mount, try to silently resolve the current session via the
  // refresh-token cookie (apiClient's 401 interceptor handles the actual
  // refresh call), then fetch the profile.
  useEffect(() => {
    let isMounted = true
    authService
      .me()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser)
      })
      .catch(() => {
        if (isMounted) setUser(null)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const login = async (payload: LoginPayload) => {
    const loggedInUser = await authService.login(payload)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (payload: RegisterPayload) => {
    const newUser = await authService.register(payload)
    setUser(newUser)
    return newUser
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    const currentUser = await authService.me()
    setUser(currentUser)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
