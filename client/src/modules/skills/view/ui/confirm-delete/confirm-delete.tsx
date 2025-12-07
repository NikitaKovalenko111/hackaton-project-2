'use client'

import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRemoveSkillFromCompany } from "@/modules/skills/infrastructure/query/mutations"

export const ConfirmDeletionOfTeam = ({skillId, handleClose}: {skillId: number, handleClose: () => void}) => {

    const {mutate} = useRemoveSkillFromCompany()

    return (
        <DialogContent className="animate-appear" data-testid="confirm-delete-skill-dialog">
            <DialogHeader>
                <DialogTitle data-testid="confirm-delete-skill-title">
                    Вы уверены, что хотите удалить эту компетенцию?
                </DialogTitle>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" data-testid="confirm-delete-skill-cancel">Нет</Button>
                </DialogClose>
                <Button 
                    variant="destructive"  
                    onClick={() => {
                        mutate(skillId)
                        handleClose()
                    }}
                    data-testid="confirm-delete-skill-confirm"
                >
                    Да
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}