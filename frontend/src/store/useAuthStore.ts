import { create } from 'zustand'
import {
    login as loginService,
    logout as logoutService,
    getToken,
} from '../features/Auth/services/authService'
import type { LoginPayload, LoginResponse } from '../features/Auth/types/authTypes'

interface AuthState {
    isAuthenticated: boolean
    login: (payload: LoginPayload) => Promise<LoginResponse>
    logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
    isAuthenticated: !!getToken(),
    login: async (payload: LoginPayload) => {
        const response = await loginService(payload)
        set({ isAuthenticated: true })
        return response
    },
    logout: () => {
        logoutService()
        set({ isAuthenticated: false })
    },
}))
