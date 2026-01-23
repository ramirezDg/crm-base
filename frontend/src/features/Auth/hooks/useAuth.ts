import { login, logout, getToken } from '../services/authService'
import { useState } from 'react'
import type { LoginPayload, UseAuthReturn } from '../types/authTypes'

export function useAuth(): UseAuthReturn {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (payload: LoginPayload) => {
        setLoading(true)
        setError(null)
        try {
            const response = await login(payload)
            setIsAuthenticated(true)
            setLoading(false)
            return response
        } catch (err: any) {
            setError(err?.message || 'Error al iniciar sesión')
            setIsAuthenticated(false)
            setLoading(false)
            throw err
        }
    }

    const handleLogout = () => {
        logout()
        setIsAuthenticated(false)
    }

    return {
        isAuthenticated,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        getToken,
    }
}
