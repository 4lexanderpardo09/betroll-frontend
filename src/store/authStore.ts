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

const logoutActions: (() => void)[] = []

export const registerLogoutAction = (action: () => void) => {
  logoutActions.push(action)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken) => {
        // Clear other stores when login (new user or different user)
        logoutActions.forEach(action => action())
        set({ user, accessToken, isAuthenticated: true })
      },
      
      setAccessToken: (accessToken) => set({ accessToken }),
      
      logout: () => {
        logoutActions.forEach(action => action())
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
      
      clearAuth: () => {
        logoutActions.forEach(action => action())
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'betroll-auth',
    }
  )
)
