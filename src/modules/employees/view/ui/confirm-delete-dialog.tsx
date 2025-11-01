'use client'

import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDeleteEmployee } from "../../infrastructure/query/mutations"

export const ConfirmDeleteDialog = ({
    employeeId,
    handleClose
}: {
    employeeId: number,
    handleClose: () => void
}) => {

    const {mutate} = useDeleteEmployee()
    
    return (
        <DialogContent className="animate-appear">
            <DialogHeader>
                <DialogTitle>
                    Вы уверены, что хотите удалить сотрудника из компании?
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="mt-3">
                <DialogClose asChild>
                    <Button variant="outline">Нет</Button>
                </DialogClose>
                <Button 
                    onClick={() => {
                        mutate(employeeId)
                        handleClose()
                    }} 
                    variant="destructive"
                >
                    Да
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}