'use client'

import * as React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'
import {
    ArrowUpDown,
    ChevronDown,
    Info,
    MoreHorizontal,
    Trash,
    UserPen,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SkillOrderGet, SkillTable } from '@/modules/skills/domain/skills.types'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/libs/providers/ability-provider'
import { InfoDialog } from '../info-dialog/info-dialog'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDeletionOfTeam } from '../../ui/confirm-delete/confirm-delete'
import { Option } from '@/components/ui/multi-select'
import { useGetCompanySkills } from '@/modules/skills/infrastructure/query/queries'
import MultipleSelectWithPlaceholderDemo from '../../ui/select-skill/select-skill'
import { CreateOrder } from '../create-order/create-order'
import { OrderInfo } from '../order-info/order-info'
const Cookies = require('js-cookie')

interface SkillsTableProps {
    data: SkillOrderGet[]
    isFetching: boolean
    handleChangeSelectedSkills: (names: string[]) => void
}

export function SkillOrdersTable({
    data,
    isFetching,
    handleChangeSelectedSkills,
}: SkillsTableProps) {
    const [openCreateDialog, setOpenCreateDialog] =
        React.useState<boolean>(false)
    const [skillId, setSkillId] = React.useState<number>(0)
    const [openConfirmDelete, setOpenConfirmDelete] =
        React.useState<boolean>(false)
    const [skills, setSkills] = React.useState<
        { skill_shape_id: number; skill_name: string }[]
    >([])

    const [openInfoDialog, setOpenInfoDialog] = React.useState<boolean>(false)
    const [orderData, setOrderData] = React.useState<SkillOrderGet | null>(null)

    const handleCloseInfoDialog = () => {
        setOpenInfoDialog(false)
        setOrderData(null)
    }

    const handleOpenInfoDialog = (data: SkillOrderGet) => {
        setOpenInfoDialog(true)
        setOrderData(data)
    }

    const handleOpenConfirmDeleteDialog = (employeeId: number) => {
        setSkillId(employeeId)
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDeleteDialog = () => {
        setSkillId(0)
        setOpenConfirmDelete(false)
    }

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [categories, setCategories] = React.useState<Option[] | null>(null)
    const { data: skillsData, refetch, isSuccess } = useGetCompanySkills(false)

    React.useEffect(() => {
        console.log(openCreateDialog)
    }, [openCreateDialog])

    React.useEffect(() => {}, [categories])

    React.useEffect(() => {
        if (skillsData) {
            const newSkills = skillsData.map((skillData) => ({
                label: skillData.skill_name,
                value: skillData.skill_name,
            })) as Option[]

            const skillsNeeded = skillsData.map((skillData) => ({
                skill_shape_id: skillData.skill_shape_id,
                skill_name: skillData.skill_name,
            }))

            setCategories(newSkills)
            setSkills(skillsNeeded)
        }
    }, [isSuccess])

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false)
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const { push } = useRouter()

    const { companyId } = useAuth()

    const columns: ColumnDef<SkillOrderGet>[] = [
        {
            accessorKey: 'skill_name',
            header: () => {
                return <p className="text-center">Название</p>
            },
            cell: ({ row }) => (
                <div className="text-center capitalize">
                    {row.original.skill_shape.skill_name}
                </div>
            ),
        },
        {
            accessorKey: 'skill_level',
            header: ({ column }) => {
                return (
                    <div className="w-full flex items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }>
                            Уровень
                            <ArrowUpDown />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('skill_level')}</div>
            ),
        },
        {
            accessorKey: 'actions',
            header: () => <div className="text-center">Действия</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2 justify-center">
                        <Info
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => {
                                handleOpenInfoDialog(row.original)
                            }}
                        />
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <Dialog
                key={'create-dialog'}
                open={openCreateDialog}
                onOpenChange={handleCloseCreateDialog}>
                <div className="flex justify-between items-center py-4 sm:flex-wrap gap-2.5">
                    {/* <Input
                    placeholder="Фильтр по названию"
                    value={(table.getColumn("skill_desc")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("skill_desc")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    /> */}
                    <MultipleSelectWithPlaceholderDemo
                        categories={categories || []}
                        handleChangeSkills={handleChangeSelectedSkills}
                    />
                    <Button
                        onClick={() => handleOpenCreateDialog()}
                        variant="default">
                        Добавить регламент
                    </Button>
                </div>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {isFetching ? (
                            <TableBody>
                                <TableRow className="animate-appear">
                                    <TableCell>
                                        <Skeleton className="w-full h-4" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-full h-4" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-full h-4" />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody className="animate-appear">
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            className="animate-appear">
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center">
                                            Пусто
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                            Назад
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                            Дальше
                        </Button>
                    </div>
                </div>
                {/* <CreateSkill handleCloseDialog={handleCloseCreateDialog} companyId={companyId!} /> */}
                {openCreateDialog && (
                    <CreateOrder
                        skills={skills}
                        handleCloseDialog={handleCloseCreateDialog}
                        companyId={companyId || -1}
                    />
                )}
            </Dialog>
            <Dialog
                open={openConfirmDelete}
                onOpenChange={handleCloseConfirmDeleteDialog}>
                {openConfirmDelete && (
                    <ConfirmDeletionOfTeam
                        handleClose={handleCloseConfirmDeleteDialog}
                        skillId={skillId}
                    />
                )}
            </Dialog>
            <Dialog open={openInfoDialog} onOpenChange={handleCloseInfoDialog}>
                {openInfoDialog && (
                    <OrderInfo
                        data={orderData || null}
                        handleClose={handleCloseInfoDialog}
                    />
                )}
            </Dialog>
            {/* <Dialog open={openConfirmDelete} onOpenChange={handleCloseConfirmDeleteDialog}>
                {openConfirmDelete && <CreateOrder handleCloseDialog={handleCloseCreateDialog} companyId={companyId || -1} />}
            </Dialog> */}
        </div>
    )
}
