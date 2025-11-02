"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash, UserPen } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkillTable } from "@/modules/skills/domain/skills.types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateSkill } from "../create-skill/create-skill";
import { useAuth } from "@/libs/providers/ability-provider";
import { InfoDialog } from "../info-dialog/info-dialog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDeletionOfTeam } from "../../ui/confirm-delete/confirm-delete";
const Cookies = require("js-cookie")


interface SkillsTableProps {
    data: SkillTable[]
    isFetching: boolean
}



export function SkillsTable({data, isFetching}: SkillsTableProps) {

    const [openCreateDialog, setOpenCreateDialog] = React.useState<boolean>(false)
    // const [openInfoDialog, setOpenInfoDialog] = React.useState<boolean>(false)
    const [skillId, setSkillId] = React.useState<number>(0)
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState<boolean>(false)

    const handleOpenConfirmDeleteDialog = (employeeId: number) => {
        setSkillId(employeeId)
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDeleteDialog = () => {
        setSkillId(0)
        setOpenConfirmDelete(false)
    }

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false)
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    // const handleCloseInfoDialog = () => {
    //     setSkillId(0)
    //     setOpenInfoDialog(false)
    // }

    // const handleOpenInfoDialog = (skillId: number) => {
    //     setSkillId(skillId)
    //     setOpenInfoDialog(true)
    // }

    const {push} = useRouter()

    const {companyId} = useAuth()

    const columns: ColumnDef<SkillTable>[] = [
        {
            accessorKey: "skill_name",
            header: () => {
                return (
                    <p className="text-center">
                        Название
                    </p>
                )
            },
            cell: ({ row }) => (
            <div className="text-center capitalize">{row.getValue("skill_name")}</div>
            ),
        },
        {
            accessorKey: "skill_desc",
            header: ({ column }) => {
            return (
                <div className="w-full flex items-center justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Описание
                        <ArrowUpDown />
                    </Button>
                </div>
                
            );
            },
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("skill_desc")}</div>,
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-center">Действия</div>,
            cell: ({ row }) => {

            return (
                <div className="flex gap-2 justify-center">
                    <UserPen className="w-4 h-4 cursor-pointer" onClick={() => push(`skills-settings/${row.original.skill_shape_id}`)} />
                    <Trash 
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleOpenConfirmDeleteDialog(row.original.skill_shape_id)}
                    />
                </div>
            );
            },
        },
    ];

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


    return (
        <div className="w-full">
            <Dialog key={"create-dialog"} open={openCreateDialog} onOpenChange={handleCloseCreateDialog}>
                <div className="flex justify-end items-center py-4 sm:flex-wrap gap-2.5">
                    {/* <Input
                    placeholder="Фильтр по названию"
                    value={(table.getColumn("skill_desc")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("skill_desc")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    /> */}
                        <Button onClick={() => handleOpenCreateDialog()} variant="default" >Добавить компетенцию</Button>
                    
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
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody className="animate-appear">
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
                <CreateSkill handleCloseDialog={handleCloseCreateDialog} companyId={companyId!} />
            </Dialog>
            <Dialog open={openConfirmDelete} onOpenChange={handleCloseConfirmDeleteDialog}>
                {openConfirmDelete && <ConfirmDeletionOfTeam handleClose={handleCloseConfirmDeleteDialog} skillId={skillId} />}
            </Dialog>
        </div>
    );
}
