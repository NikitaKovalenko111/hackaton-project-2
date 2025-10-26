import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export const ConfirmDeleteDialog = () => {
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Вы уверены, что хотите удалить сотрудника из компании?
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="mt-3">
                <DialogClose asChild>
                    <Button variant="outline">Нет</Button>
                </DialogClose>
                <Button variant="destructive">Да</Button>
            </DialogFooter>
        </DialogContent>
    )
}