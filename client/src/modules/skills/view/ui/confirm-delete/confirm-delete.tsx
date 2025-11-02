'use client'

import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDeleteEmployee } from "@/modules/employees/infrastructure/query/mutations"
import { useDeleteTeam } from "@/modules/teams/infrastructure/query/mutations"

export const ConfirmDeletionOfTeam = ({skillId, handleClose}: {skillId: number, handleClose: () => void}) => {

    const {mutate} = useDeleteEmployee()

    return (
        <DialogContent className="animate-appear">
            <DialogHeader>
                <DialogTitle>
                    Вы уверены, что хотите удалить эту компетенцию?
                </DialogTitle>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Нет</Button>
                </DialogClose>
                <Button 
                    variant="destructive"  
                    onClick={() => {
                        mutate(skillId)
                        handleClose()
                    }}
                >
                    Да
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}