import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonInfoDialog = () => {
    return (
        <DialogContent className="animate-appear">
            <DialogHeader>
                <DialogTitle>
                    <Skeleton className="w-30 h-4" />
                </DialogTitle>
                <Skeleton className="w-40 h-4" />
            </DialogHeader>
            <div className="grid gap-4">
                <div className="flex justify-center">
                    <Skeleton className="w-24 h-24 rounded-full" />
                </div>
                <div>
                    <Skeleton className="w-40 h-5" />
                </div>
                <div>
                    <Skeleton className="w-40 h-5" />
                </div>
                <Skeleton className="w-full h-7" />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Skeleton className="w-40 h-5" />
                </DialogClose>
                <Skeleton className="w-40 h-5" />
            </DialogFooter>
        </DialogContent>
    )
}
