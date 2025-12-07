'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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
import { ArrowUpDown, Pen, Trash } from 'lucide-react'
import React from 'react'
import { useAuth } from '@/libs/providers/ability-provider'
import { Team } from '@/modules/teams/domain/teams.type'
import { AddTeam } from '../add-team/add-team'
import { ConfirmDeletionOfTeam } from '../confirm-delete/confirm-delete'

interface TeamsTableProps {
    data: Team[]
    openAddDialog: boolean // Принимаем пропс
    onCloseAddDialog: () => void // Принимаем коллбэк
}

export const TeamsTable = ({
    data,
    openAddDialog,
    onCloseAddDialog,
}: TeamsTableProps) => {
    // Убрано локальное состояние openAddDialog
    const [openInfoDialog, setOpenInfoDialog] = React.useState<boolean>(false)
    const [openConfirmDelete, setOpenConfirmDelete] =
        React.useState<boolean>(false)
    const [teamId, setTeamId] = React.useState<number>(0)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const handleOpenConfirmDeleteDialog = (employeeId: number) => {
        setTeamId(employeeId)
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDeleteDialog = () => {
        setTeamId(0)
        setOpenConfirmDelete(false)
    }

    const handleOpenInfoDialog = (employeeId: number) => {
        setTeamId(employeeId)
        setOpenInfoDialog(true)
    }

    const handleCloseInfoDialog = () => {
        setTeamId(0)
        setOpenInfoDialog(false)
    }

    const columns: ColumnDef<Team>[] = [
        {
            accessorKey: 'team_name',
            header: () => {
                return <p className="text-center">Название</p>
            },
            cell: ({ row }) => (
                <div className="text-center capitalize">
                    {row.getValue('team_name')}
                </div>
            ),
        },
        {
            accessorKey: 'teamlead',
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
                            Тимлид
                            <ArrowUpDown />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="text-center capitalize">{`${row.original.teamlead.employee_surname} ${row.original.teamlead.employee_name}`}</div>
            ),
        },
        {
            accessorKey: 'actions',
            header: ({ column }) => {
                return <div className="flex justify-center">Действия</div>
            },
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center gap-1">
                        {/* <Pen 
                            className="w-4 h-4 cursor-pointer" 
                            onClick={() => handleOpenInfoDialog(row.original.team_id)}
                        /> */}
                        <Trash
                            className="w-4 h-4 cursor-pointer"
<<<<<<< HEAD
                            onClick={() =>
                                handleOpenConfirmDeleteDialog(
                                    row.original.team_id
                                )
                            }
=======
                            onClick={() => handleOpenConfirmDeleteDialog(row.original.team_id)}
                            data-testid={`team-delete-button-${row.original.team_id}`}
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                        />
                    </div>
                )
            },
        },
    ]

    // Убраны функции handleOpenAddDialog и handleCloseAddDialog

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

    const { companyId } = useAuth()

    return (
        <div className="w-full" data-testid="teams-table-container">
            {/* Диалог AddTeam остается здесь, но управляется извне */}
            <Dialog open={openAddDialog} onOpenChange={onCloseAddDialog}>
                {/* Убрана кнопка из этого компонента */}
                <div className="flex justify-end items-center py-4 sm:flex-wrap gap-2.5">
                    {/* Можно оставить поле фильтрации, если нужно */}
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
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
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
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
<<<<<<< HEAD
                            disabled={!table.getCanPreviousPage()}>
=======
                            disabled={!table.getCanPreviousPage()}
                            data-testid="teams-table-previous-button"
                        >
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                            Назад
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
<<<<<<< HEAD
                            disabled={!table.getCanNextPage()}>
=======
                            disabled={!table.getCanNextPage()}
                            data-testid="teams-table-next-button"
                        >
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                            Дальше
                        </Button>
                    </div>
                </div>
                <AddTeam
                    companyId={companyId!}
                    handleCloseDialog={onCloseAddDialog}
                />
            </Dialog>
            <Dialog
                open={openConfirmDelete}
                onOpenChange={handleCloseConfirmDeleteDialog}>
                {openConfirmDelete && (
                    <ConfirmDeletionOfTeam
                        teamId={teamId}
                        handleClose={handleCloseConfirmDeleteDialog}
                    />
                )}
            </Dialog>
        </div>
    )
}
