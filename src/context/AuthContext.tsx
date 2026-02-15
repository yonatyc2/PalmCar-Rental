import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '../types/user'
import * as storage from '../lib/storage'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: { name?: string; email?: string }) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = storage.getSession()
    if (session) {
      setUser({
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
      })
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const found = storage.validateLogin(email, password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const u: User = { id: found.id, email: found.email, name: found.name, role: found.role }
    storage.setSession(found)
    setUser(u)
    return { success: true }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const created = storage.registerUser(email, password, name)
      const u: User = { id: created.id, email: created.email, name: created.name, role: created.role }
      storage.setSession(created)
      setUser(u)
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Registration failed' }
    }
  }, [])

  const logout = useCallback(() => {
    storage.clearSession()
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates: { name?: string; email?: string }) => {
    if (!user) return
    storage.updateStoredUser(user.id, updates)
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }, [user])

  const value: AuthContextValue = { user, isLoading, login, register, logout, updateProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
