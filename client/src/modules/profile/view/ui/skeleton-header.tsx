import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const SkeletonHeader = () => {

    return (
        <Card>
            <CardContent>
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <div className="relative">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <Skeleton className="w-36 h-6" />
                        </div>
                        {/* <Skeleton className="w-20 h-3" /> */}
                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-16 h-2" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-16 h-2" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="w-25 h-7" />
                </div>
            </CardContent>
        </Card>
    )
}