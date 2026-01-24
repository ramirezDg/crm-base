import { z } from 'zod'

// usersTypes

export type Entity<T = Record<string, any>> = T & {
    id: string | number
    createdAt?: string | Date
    updatedAt?: string | Date
    deletedAt?: string | Date
}

export type UserEntity = Entity<{
    name: string
    email: string
    role: string
    isActive: boolean
}>

export type UsersType = UserEntity[]

export type RoleEntity = Entity<{
    name: string
}>

export type CompanyEntity = Entity<{
    name: string
}>

export type UsersSuuType = Entity<{
    name: string
    lastName: string
    email: string
    hashedRt?: string | null
    role: RoleEntity
    company: CompanyEntity
    status: boolean
}>

export type UsersSuuTableType = Entity<{
    name: string
    lastName: string
    email: string
    role: RoleEntity
    company: CompanyEntity
    status: boolean
}>

export const UsersSuuTableSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.object({
        id: z.union([z.string(), z.number()]),
        name: z.string(),
    }),
    company: z.object({
        id: z.union([z.string(), z.number()]),
        name: z.string(),
    }),
    status: z.boolean(),
})
