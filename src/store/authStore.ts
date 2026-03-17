import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      
      setAccessToken: (accessToken) => set({ accessToken }),
      
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      
      clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'betroll-auth',
    }
  )
)
