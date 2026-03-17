import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('should initialize with empty auth state', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('should set auth state', () => {
    const { setAuth } = useAuthStore.getState()
    const user = { id: '1', email: 'test@test.com', name: 'Test' }
    
    setAuth(user, 'token123')
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.accessToken).toBe('token123')
  })

  it('should clear auth state on logout', () => {
    const { setAuth, logout } = useAuthStore.getState()
    const user = { id: '1', email: 'test@test.com', name: 'Test' }
    
    setAuth(user, 'token123')
    logout()
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
  })

  it('should update access token', () => {
    const { setAuth, setAccessToken } = useAuthStore.getState()
    const user = { id: '1', email: 'test@test.com', name: 'Test' }
    
    setAuth(user, 'token123')
    setAccessToken('new_token')
    
    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('new_token')
  })
})
