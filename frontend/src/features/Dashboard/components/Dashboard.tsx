import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'

import data from '../../../app/dashboard/data.json'
import { schemaDashboard } from '../types/dashboardTypes'
import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@radix-ui/react-checkbox'
import { Badge } from '../../../components/ui/badge'
import { IconCircleCheckFilled, IconDotsVertical, IconLoader } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Select } from '@radix-ui/react-select'
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select'
import { DropdownMenu, DropdownMenuItem } from '../../../components/ui/dropdown-menu'
import {
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { Button } from '../../../components/ui/button'
import type z from 'zod'
import { AbstractDataTable, DragHandle } from '../../../components/table/AbstractDataTable'
export default function Dashboard() {
    const columns: ColumnDef<z.infer<typeof schemaDashboard>>[] = [
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
            accessorKey: 'header',
            header: 'Header',
            cell: ({ row }) => {
                return {
                    /* <TableCellViewer item={row.original} /> */
                }
            },
            enableHiding: false,
        },
        {
            accessorKey: 'type',
            header: 'Section Type',
            cell: ({ row }) => (
                <div className='w-32'>
                    <Badge
                        variant='outline'
                        className='text-neutral-500 px-1.5 dark:text-neutral-400'
                    >
                        {row.original.type}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant='outline' className='text-neutral-500 px-1.5 dark:text-neutral-400'>
                    {row.original.status === 'Done' ? (
                        <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
                    ) : (
                        <IconLoader />
                    )}
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: 'target',
            header: () => <div className='w-full text-right'>Target</div>,
            cell: ({ row }) => (
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
                            loading: `Saving ${row.original.header}`,
                            success: 'Done',
                            error: 'Error',
                        })
                    }}
                >
                    <Label htmlFor={`${row.original.id}-target`} className='sr-only'>
                        Target
                    </Label>
                    <Input
                        className='hover:bg-neutral-200/30 focus-visible:bg-white dark:hover:bg-neutral-200/30 dark:focus-visible:bg-neutral-200/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent dark:hover:bg-neutral-800/30 dark:focus-visible:bg-neutral-950 dark:dark:hover:bg-neutral-800/30 dark:dark:focus-visible:bg-neutral-800/30'
                        defaultValue={row.original.target}
                        id={`${row.original.id}-target`}
                    />
                </form>
            ),
        },
        {
            accessorKey: 'limit',
            header: () => <div className='w-full text-right'>Limit</div>,
            cell: ({ row }) => (
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
                            loading: `Saving ${row.original.header}`,
                            success: 'Done',
                            error: 'Error',
                        })
                    }}
                >
                    <Label htmlFor={`${row.original.id}-limit`} className='sr-only'>
                        Limit
                    </Label>
                    <Input
                        className='hover:bg-neutral-200/30 focus-visible:bg-white dark:hover:bg-neutral-200/30 dark:focus-visible:bg-neutral-200/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent dark:hover:bg-neutral-800/30 dark:focus-visible:bg-neutral-950 dark:dark:hover:bg-neutral-800/30 dark:dark:focus-visible:bg-neutral-800/30'
                        defaultValue={row.original.limit}
                        id={`${row.original.id}-limit`}
                    />
                </form>
            ),
        },
        {
            accessorKey: 'reviewer',
            header: 'Reviewer',
            cell: ({ row }) => {
                const isAssigned = row.original.reviewer !== 'Assign reviewer'

                if (isAssigned) {
                    return row.original.reviewer
                }

                return (
                    <>
                        <Label htmlFor={`${row.original.id}-reviewer`} className='sr-only'>
                            Reviewer
                        </Label>
                        <Select>
                            <SelectTrigger
                                className='w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate'
                                size='sm'
                                id={`${row.original.id}-reviewer`}
                            >
                                <SelectValue placeholder='Assign reviewer' />
                            </SelectTrigger>
                            <SelectContent align='end'>
                                <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
                                <SelectItem value='Jamik Tashpulatov'>Jamik Tashpulatov</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                )
            },
        },
        {
            id: 'actions',
            cell: () => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            className='data-[state=open]:bg-neutral-100 text-neutral-500 flex size-8 dark:data-[state=open]:bg-neutral-800 dark:text-neutral-400'
                            size='icon'
                        >
                            <IconDotsVertical />
                            <span className='sr-only'>Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-32'>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Make a copy</DropdownMenuItem>
                        <DropdownMenuItem>Favorite</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]
    return (
        <>
            <SectionCards />
            <div className='px-4 lg:px-6'>
                <ChartAreaInteractive />
            </div>
            <AbstractDataTable data={data} schema={schemaDashboard} columns={columns} />
        </>
    )
}
