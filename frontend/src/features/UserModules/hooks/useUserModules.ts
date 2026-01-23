import { useState } from 'react'
import { findAll } from '../services/userModulesService'
import { useUserModulesStore } from '../../../store/useUserModulesStore'

export function useUserModules() {
    const loading = useUserModulesStore(state => state.loading)
    const setLoading = useUserModulesStore(state => state.setLoading)
    const data = useUserModulesStore(state => state.modules)
    const setData = useUserModulesStore(state => state.setModules)
    const [error, setError] = useState<string | null>(null)

    const getUserModules = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await findAll()
            setLoading(false)
            setData(response)
        } catch (err: any) {
            setError(err?.message || 'Error al cargar los módulos del usuario')
            setLoading(false)
            throw err
        }
    }

    return {
        loading,
        error,
        getUserModules,
        usersModules: data,
    }
}
