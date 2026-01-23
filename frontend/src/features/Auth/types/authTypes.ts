import type { getToken } from '../services/authService'

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    sub: string
    email: string
    name: string
}

export type UseAuthReturn = {
    isAuthenticated: boolean
    loading: boolean
    error: string | null
    login: (payload: LoginPayload) => Promise<any>
    logout: () => void
    getToken: typeof getToken
}
