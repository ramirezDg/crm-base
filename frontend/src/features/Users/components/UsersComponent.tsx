import { IconDotsVertical, IconGripVertical } from '@tabler/icons-react'
import { useSortable } from '@dnd-kit/sortable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '../../../components/ui/button'
import { UsersSuuTableSchema, type UsersSuuTableType } from '../types/usersTypes'
import { Checkbox } from '../../../components/ui/checkbox'
import { Badge } from '../../../components/ui/badge'
import { AbstractDataTable, DragHandle } from '../../../components/table/AbstractDataTable'
import { useUsers } from '../hooks/useUsers'
import { useEffect } from 'react'

export default function Users() {
    const { loading, error, getUsers, users } = useUsers()

    useEffect(() => {
        getUsers()
    }, [])

    const columns: ColumnDef<UsersSuuTableType>[] = [
        {
            id: 'drag',
            header: () => null,
            cell: ({ row }) => <DragHandle id={String(row.original.id)} />,
        },
        {
            id: 'select',
            header: ({ table }) => (
                <div className='flex items-center justify-center'>
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                        aria-label='Select all'
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className='flex items-center justify-center'>
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={value => row.toggleSelected(!!value)}
                        aria-label='Select row'
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'count',
            header: '#',
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: 'lastName',
            header: 'Apellido',
            cell: ({ row }) => row.original.lastName,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: 'role',
            header: 'Rol',
            cell: ({ row }) => row.original.role.name,
        },
        {
            accessorKey: 'company',
            header: 'Compañía',
            cell: ({ row }) => row.original.company.name,
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) =>
                row.original.status ? (
                    <Badge variant='outline' className='text-green-600'>
                        Activo
                    </Badge>
                ) : (
                    <Badge variant='outline' className='text-red-600'>
                        Inactivo
                    </Badge>
                ),
        },
        {
            id: 'actions',
            cell: () => (
                <Button variant='ghost' size='icon'>
                    <IconDotsVertical />
                    <span className='sr-only'>Open menu</span>
                </Button>
            ),
        },
    ]
    return (
        <AbstractDataTable<UsersSuuTableType>
            data={users?.results}
            schema={UsersSuuTableSchema}
            columns={columns}
            loading={loading}
            error={error}
        />
    )
}
