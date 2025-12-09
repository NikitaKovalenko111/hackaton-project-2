'use client'

import { Button } from '@/components/ui/button'
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteEmployee } from '../../infrastructure/query/mutations'

export const ConfirmDeleteDialog = ({
    employeeId,
    handleClose,
}: {
    employeeId: number
    handleClose: () => void
}) => {
    const { mutate } = useDeleteEmployee()

    return (
        <DialogContent className="animate-appear" data-testid="confirm-delete-employee-dialog">
            <DialogHeader>
                <DialogTitle data-testid="confirm-delete-employee-title">
                    Вы уверены, что хотите удалить сотрудника из компании?
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="mt-3">
                <DialogClose asChild>
                    <Button variant="outline" data-testid="confirm-delete-employee-cancel">Нет</Button>
                </DialogClose>
                <Button
                    onClick={() => {
                        mutate(employeeId)
                        handleClose()
                    }} 
                    variant="destructive"
                    data-testid="confirm-delete-employee-confirm"
                >
                    Да
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
