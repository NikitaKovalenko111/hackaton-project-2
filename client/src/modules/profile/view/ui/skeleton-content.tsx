import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export const SkeletonContent = () => {
    
    return (
        <Tabs defaultValue="personal" className="space-y-6">
        <Skeleton className="w-full h-10" />

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
            <Card>
            <CardHeader>
                <Skeleton className="w-48 h-8" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="w-full h-6" />
                    </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="w-full h-6" />
                </div>
            </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
    )
}