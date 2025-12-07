'use client'

import { Button } from '@/components/ui/button'
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteTeam } from '@/modules/teams/infrastructure/query/mutations'

export const ConfirmDeletionOfTeam = ({
    teamId,
    handleClose,
}: {
    teamId: number
    handleClose: () => void
}) => {
    const { mutate } = useDeleteTeam()

    return (
        <DialogContent className="animate-appear" data-testid="confirm-delete-team-dialog">
            <DialogHeader>
                <DialogTitle data-testid="confirm-delete-team-title">
                    Вы уверены, что хотите удалить эту команду?
                </DialogTitle>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" data-testid="confirm-delete-team-cancel">Нет</Button>
                </DialogClose>
                <Button
                    variant="destructive"
                    onClick={() => {
                        mutate(teamId)
                        handleClose()
<<<<<<< HEAD
                    }}>
=======
                    }}
                    data-testid="confirm-delete-team-confirm"
                >
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                    Да
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
