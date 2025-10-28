'use client'

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeTable } from "@/modules/employees/domain/employees.type";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Pen, Trash } from "lucide-react";
import React, { useState } from "react";
import { AddEmployee } from "../add-employee/add-employee";
import { useAuth } from "@/libs/providers/ability-provider";
import { roleBadge } from "../../ui/role-badge";
import { InfoDialog } from "../info-dialog/info-dialog";
import { ConfirmDeleteDialog } from "../../ui/confirm-delete-dialog";
import { Team } from "@/modules/teams/domain/teams.type";
import { Skeleton } from "@/components/ui/skeleton";


export const EmployeesTable = ({data, isFetching}: {isFetching: boolean, data: EmployeeTable[]}) => {
    const [openAddDialog, setOpenAddDialog] = React.useState<boolean>(false)
    const [openInfoDialog, setOpenInfoDialog] = React.useState<boolean>(false)
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState<boolean>(false)
    
    const [employeeId, setEmployeeId] = React.useState<number>(0)
    const [employeeTeam, setEmployeeTeam] = React.useState<Team | null>(null)

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const handleOpenConfirmDeleteDialog = (employeeId: number) => {
        setEmployeeId(employeeId)
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDeleteDialog = () => {
        setEmployeeId(0)
        setOpenConfirmDelete(false)
    }

    const handleOpenInfoDialog = (employeeId: number, team: Team | null) => {
        setEmployeeId(employeeId)
        setEmployeeTeam(team)
        setOpenInfoDialog(true)
    }

    const handleCloseInfoDialog = () => {
            setEmployeeId(0)
            setEmployeeTeam(null)
            setOpenInfoDialog(false)
    }

    const columns: ColumnDef<EmployeeTable>[] = [
        {
            accessorKey: "employee_surname",
            header: () => {
                return (
                    <p className="text-center">
                        Фамилия
                    </p>
                )
            },
            cell: ({ row }) => (
            <div className="text-center capitalize">{row.getValue("employee_surname")}</div>
            ),
        },
        {
            accessorKey: "employee_name",
            header: ({ column }) => {
            return (
                <div className="w-full flex items-center justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Имя
                        <ArrowUpDown />
                    </Button>
                </div>
                
            );
            },
            cell: ({ row }) => <div className="text-center capitalize">{row.getValue("employee_name")}</div>,
        },
        {
            accessorKey: "role",
            header: ({column}) => {
                return (
                    <div className="flex items-center justify-center">
                        Роль
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-center capitalize">{roleBadge(row.original.role)}</div>
        },
        {
            accessorKey: 'actions',
            header: ({column}) => {

                return (
                    <div className="flex justify-center">
                        Действия
                    </div>
                )
            },
            cell: ({row}) => {
                
                return (
                    <div className="flex justify-center gap-1">
                        <Pen 
                            className="w-4 h-4 cursor-pointer" 
                            onClick={() => handleOpenInfoDialog(row.original.employee_id, row.original.team)}
                        />
                        <Trash 
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleOpenConfirmDeleteDialog(row.original.employee_id)}
                        />
                    </div>
                )
            }
        }
    ];

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true)
    }

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false)
    }

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
    });

    const {companyId} = useAuth()


    return (
        <div className="w-full">
            <Dialog open={openAddDialog} onOpenChange={handleCloseAddDialog}>
                <div className="flex justify-end items-center py-4 sm:flex-wrap gap-2.5">
                    {/* <Input
                    placeholder="Фильтр по имени"
                    value={(table.getColumn("employee_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("employee_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    /> */}
                    <Button onClick={() => handleOpenAddDialog()} variant="default">Добавить сотрудника</Button>
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
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
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
                                <TableCell>
                                    <Skeleton className="w-full h-4" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="animate-appear"
                                >
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
                                    className="h-24 text-center"
                                >
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
                        disabled={!table.getCanPreviousPage()}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Дальше
                    </Button>
                    </div>
                </div>
                <AddEmployee companyId={companyId!} handleCloseDialog={handleCloseAddDialog} />
            </Dialog>
            {openInfoDialog && <Dialog open={openInfoDialog} onOpenChange={handleCloseInfoDialog}>
                <InfoDialog open={openInfoDialog} team={employeeTeam} id={employeeId} />
            </Dialog>}
            <Dialog open={openConfirmDelete} onOpenChange={handleCloseConfirmDeleteDialog}>
                <ConfirmDeleteDialog />
            </Dialog>
        </div>
    );
}