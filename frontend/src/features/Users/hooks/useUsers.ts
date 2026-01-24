import { useState } from 'react'
import type { PaginatedResponse } from '../../../types/paginatedResponse.type'
import type { UsersSuuTableType } from '../types/usersTypes'
import { findAllUsers } from '../services/usersService'

export function useUsers() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<PaginatedResponse<UsersSuuTableType>>({
        total: 0,
        limit: 10,
        offset: 0,
        results: [],
    })

    const getUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await findAllUsers()
            setUsers(response)
            setLoading(false)
        } catch (err: any) {
            setError(err?.message || 'Error al cargar los usuarios')
            setLoading(false)
            throw err
        }
    }

    return {
        loading,
        error,
        getUsers,
        users,
    }
}
