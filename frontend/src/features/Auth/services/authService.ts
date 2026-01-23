import api from '../../../lib/axios'
import type { LoginPayload, LoginResponse } from '../types/authTypes'

const TOKEN_KEY = 'token'

function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post('/auth/login', payload)
    setToken(response.data.accessToken)
    return response.data
}

export function logout() {
    removeToken()
}

export { getToken }
