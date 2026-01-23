import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserModulesType } from '../features/UserModules/types/userModulesTypes'

type UserModulesStore = {
    modules: UserModulesType[]
    loading: boolean
    setModules: (modules: UserModulesType[]) => void
    setLoading: (loading: boolean) => void
}

export const useUserModulesStore = create<UserModulesStore>()(
    persist(
        set => ({
            modules: [],
            loading: false,
            setModules: modules => set({ modules }),
            setLoading: loading => set({ loading }),
        }),
        {
            name: 'user-modules-storage',
        },
    ),
)
