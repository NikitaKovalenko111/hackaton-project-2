'use client'

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROLE_TRANSLATION } from "@/libs/constants";
import { roleBadge } from "@/modules/employees/view/ui/role-badge";
import { Employee } from "@/modules/profile/domain/profile.types"
import { EmployeeTable } from "@/modules/skills/domain/skills.types";
import { useGiveSkill, useRemoveSkill } from "@/modules/skills/infrastructure/query/mutations";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react"

export const SkillUsersTable = ({
    id,
    users,
    companyId
}: {
    id: number,
    users: EmployeeTable[],
    companyId: number
}) => {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [addedUsers, setAddedUsers] = useState<EmployeeTable[]>([])
    const [removedUsers, setRemovedUsers] = useState<EmployeeTable[]>([])

    const handleAddUserToSkill = (user: EmployeeTable) => {
        setAddedUsers(prev => [...prev, user])
        setRemovedUsers(prev => prev.filter((empl) => empl.employee_id != user.employee_id))
    }

    const handleRemoveUserToSkill = (user: EmployeeTable) => {
        setRemovedUsers(prev => [...prev, user])
        setAddedUsers(prev => prev.filter((empl) => empl.employee_id != user.employee_id))
    }

    useEffect(() => {
        setAddedUsers(users.filter((user) => user.skills.length > 0))
        setRemovedUsers(users.filter((user) => user.skills.length == 0))
    }, [users])

    const {mutate: giveSkill} = useGiveSkill()
    const {mutate: removeSkill} = useRemoveSkill()

    const columnsAdded: ColumnDef<EmployeeTable>[] = [
        {
            accessorKey: "employee_name",
            header: () => {
                return (
                    <p className="text-center">
                        Имя Фамилия
                    </p>
                )
            },
            cell: ({ row }) => (
            <div className="text-center capitalize">{`${row.original.employee_name} ${row.original.employee_surname}`}</div>
            ),
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
            return (
                <div className="w-full flex items-center justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Роль
                        <ArrowUpDown />
                    </Button>
                </div>
                
            );
            },
            cell: ({ row }) => <div className="text-center">{roleBadge(row.original.role.role_name)}</div>,
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-center">Действия</div>,
            cell: ({ row }) => {

            return (
                <div className="flex justify-center cursor-pointer">
                    <Minus 
                        className="w-5 h-5"
                        onClick={() => {
                            handleRemoveUserToSkill({
                                employee_id: row.original.employee_id,
                                employee_name: row.original.employee_name,
                                employee_surname: row.original.employee_surname,
                                role: row.original.role,
                                skills: row.original.skills
                            })
                            removeSkill(row.original.skills.find((skillShape) => skillShape.skill_shape.skill_shape_id == id)?.skill_connection_id!)
                        }}
                    />
                </div>
            );
            },
        },
    ];

    const columnsRemoved: ColumnDef<EmployeeTable>[] = [
        {
            accessorKey: "employee_name",
            header: () => {
                return (
                    <p className="text-center">
                        Имя Фамилия
                    </p>
                )
            },
            cell: ({ row }) => (
            <div className="text-center capitalize">{`${row.original.employee_name} ${row.original.employee_surname}`}</div>
            ),
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
            return (
                <div className="w-full flex items-center justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Роль
                        <ArrowUpDown />
                    </Button>
                </div>
                
            );
            },
            cell: ({ row }) => <div className="text-center ">{roleBadge(row.original.role.role_name)}</div>,
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-center">Действия</div>,
            cell: ({ row }) => {

            return (
                <div className="flex justify-center cursor-pointer">
                    
                    <Plus 
                        className="w-5 h-5"
                        onClick={() => {
                            handleAddUserToSkill({
                                employee_id: row.original.employee_id,
                                employee_name: row.original.employee_name,
                                employee_surname: row.original.employee_surname,
                                role: row.original.role,
                                skills: row.original.skills
                            })
                            giveSkill({
                                company_id: companyId,
                                employee_to_give_id: row.original.employee_id,
                                skill_shape_id: id,
                                skill_level: "junior"
                            })
                        }}
                    />
                </div>
            );
            },
        },
    ];

    const tableAdded = useReactTable({
        data: addedUsers,
        columns: columnsAdded,
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

    const tableRemoved = useReactTable({
        data: removedUsers,
        columns: columnsRemoved,
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

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-md border">
                    <Table className="min-w-full">
                        <TableHeader>
                            {tableAdded.getHeaderGroups().map((headerGroup) => (
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
                    <TableBody>
                        {tableAdded.getRowModel().rows?.length ? (
                        tableAdded.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
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
                                colSpan={columnsAdded.length}
                                className="h-24 text-center"
                            >
                                Пусто
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 space-y-2 sm:space-y-0 py-3 sm:py-4">
                    <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tableAdded.previousPage()}
                        disabled={!tableAdded.getCanPreviousPage()}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tableAdded.nextPage()}
                        disabled={!tableAdded.getCanNextPage()}
                    >
                        Дальше
                    </Button>
                    </div>
                </div>
                <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-md border">
                    <Table className="min-w-full">
                        <TableHeader>
                            {tableRemoved.getHeaderGroups().map((headerGroup) => (
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
                    <TableBody>
                        {tableRemoved.getRowModel().rows?.length ? (
                        tableRemoved.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
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
                                colSpan={columnsAdded.length}
                                className="h-24 text-center"
                            >
                                Пусто
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 space-y-2 sm:space-y-0 py-3 sm:py-4">
                    <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tableRemoved.previousPage()}
                        disabled={!tableRemoved.getCanPreviousPage()}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tableRemoved.nextPage()}
                        disabled={!tableRemoved.getCanNextPage()}
                    >
                        Дальше
                    </Button>
                    </div>
                </div>
        </div>
    )
}