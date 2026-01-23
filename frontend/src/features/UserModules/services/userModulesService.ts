import api from '../../../lib/axios'
import type { UserModulesType } from '../types/userModulesTypes'

/* Services Modules */

export async function findAll(): Promise<UserModulesType[]> {
    try {
        const response = await api.get<UserModulesType[]>('/modules')
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
