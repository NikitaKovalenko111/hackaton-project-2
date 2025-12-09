import { Button } from '@/components/ui/button'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { SkillOrderGet } from '@/modules/skills/domain/skills.types'

interface OrderInfoProps {
    data: SkillOrderGet | null
    handleClose: () => void
}

export const OrderInfo = ({ data, handleClose }: OrderInfoProps) => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="capitalize">
                    Регламент компетенции {data!.skill_shape.skill_name}
                </DialogTitle>
                <DialogDescription>
                    Полная информация о регламенте.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div>
                    <p className="capitalize">Уровень: {data!.skill_level}</p>
                </div>
                <div>
                    <p className="capitalize">Критерий: {data!.order_text}</p>
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
