import api from '../../../lib/axios'
import type { PaginatedResponse } from '../../../types/paginatedResponse.type'
import type { UsersSuuTableType } from '../types/usersTypes'

export async function findAllUsers(): Promise<PaginatedResponse<UsersSuuTableType>> {
    try {
        const response = await api.get<PaginatedResponse<UsersSuuTableType>>('/users')
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
