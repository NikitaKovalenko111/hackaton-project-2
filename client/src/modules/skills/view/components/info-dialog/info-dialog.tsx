import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetSkill } from "@/modules/skills/infrastructure/query/queries"

interface InfoDialogProps {
    skill_name: string
    skill_shape_id: number
}

export const InfoDialog = ({
    id
}: {
    id: number
}) => {

    const {data, isLoading} = useGetSkill(id)

    return(
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="capitalize">Компетенция {data?.skill_name}</DialogTitle>
                <DialogDescription>
                    Полная информация о компетенции.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div>
                    <p className="capitalize">Название: {data?.skill_name}</p>
                </div>
                <div>
                    <p>Описание: {data?.skill_desc}</p>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Закрыть</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}