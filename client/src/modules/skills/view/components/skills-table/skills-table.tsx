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
    openCreateDialog: boolean // Принимаем пропс
    onCloseCreateDialog: () => void // Принимаем коллбэк
}

export const SkillsTable: React.FC<SkillsTableProps> = ({ 
    data, 
    isFetching, 
    openCreateDialog, 
    onCloseCreateDialog 
}): React.JSX.Element => {
    
    // Убрано локальное состояние openCreateDialog
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState<boolean>(false)
    const [skillId, setSkillId] = React.useState<number>(0)

    const handleOpenConfirmDeleteDialog = (employeeId: number) => {
        setSkillId(employeeId)
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDeleteDialog = () => {
        setSkillId(0)
        setOpenConfirmDelete(false)
    }

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Убраны функции handleOpenCreateDialog и handleCloseCreateDialog

    const {push} = useRouter()
    const {companyId} = useAuth()

    const columns: ColumnDef<SkillTable>[] = [
        // ... колонки остаются без изменений
        {
            accessorKey: "skill_name",
            header: () => <p className="text-center">Название</p>,
            cell: ({ row }) => (
                <div className="text-center capitalize">{row.getValue("skill_name")}</div>
            ),
        },
        {
            accessorKey: "skill_desc",
            header: ({ column }) => (
                <div className="w-full flex items-center justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Описание
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("skill_desc")}</div>,
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-center">Действия</div>,
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center">
                    <UserPen 
                        className="w-4 h-4 cursor-pointer" 
                        onClick={() => push(`skills-settings/${row.original.skill_shape_id}`)} 
                        data-testid={`skill-edit-button-${row.original.skill_shape_id}`}
                    />
                    <Trash 
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleOpenConfirmDeleteDialog(row.original.skill_shape_id)}
                        data-testid={`skill-delete-button-${row.original.skill_shape_id}`}
                    />
                </div>
            ),
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
        <div className="w-full" data-testid="skills-table-container">
            {/* Диалог CreateSkill остается здесь, но управляется извне */}
            <Dialog key={"create-dialog"} open={openCreateDialog} onOpenChange={onCloseCreateDialog}>
                {/* Убрана кнопка из этого компонента */}
                <div className="flex justify-end items-center py-2 sm:flex-wrap gap-2.5">
                    {/* Поле фильтрации остается, если нужно */}
                    {/* <Input
                        placeholder="Фильтр по названию"
                        value={(table.getColumn("skill_desc")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("skill_desc")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    /> */}
                </div>
                
                {/* Таблица и пагинация остаются без изменений */}
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        
                        {isFetching ? (
                            <TableBody>
                                <TableRow className="animate-appear">
                                    <TableCell><Skeleton className="w-full h-4" /></TableCell>
                                    <TableCell><Skeleton className="w-full h-4" /></TableCell>
                                    <TableCell><Skeleton className="w-full h-4" /></TableCell>
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
                            data-testid="skills-table-previous-button"
                        >
                            Назад
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            data-testid="skills-table-next-button"
                        >
                            Дальше
                        </Button>
                    </div>
                </div>
                
                {/* CreateSkill компонент получает пропсы */}
                <CreateSkill 
                    handleCloseDialog={onCloseCreateDialog} 
                    companyId={companyId!} 
                />
            </Dialog>
            
            {/* Диалог удаления остается здесь */}
            <Dialog open={openConfirmDelete} onOpenChange={handleCloseConfirmDeleteDialog}>
                {openConfirmDelete && (
                    <ConfirmDeletionOfTeam 
                        handleClose={handleCloseConfirmDeleteDialog} 
                        skillId={skillId} 
                    />
                )}
            </Dialog>
        </div>
    );
};