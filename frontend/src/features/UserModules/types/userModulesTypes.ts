import type { dataDateAtAtributes } from '../../../types/index.type'

// userModulesTypes
export type UserModulesType = {
    id: string
    name: string
    description: string
    path: string
    icon: string
    status: boolean
    parentId?: string | null
    children?: UserModulesType[]
} & dataDateAtAtributes
