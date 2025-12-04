import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Request } from "@/libs/constants"
import { useSocket } from "@/libs/hooks/useSocket"
import { useGetRequests } from "@/modules/profile/infrastructure/query/queries"
import { DialogTitle } from "@radix-ui/react-dialog"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const RequestsTab = ({employeeId}: {employeeId: number}) => {

    const {data, refetch, isFetching} = useGetRequests()
    const {acceptRequest, cancelRequest} = useSocket()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [justification, setJustification] = useState("")
    const [selectedRequestId, setSelectedRequestId] = useState(0)

    const handleDeleteRequest = (request_id: number) => {
        setRequests(prev => prev.filter((req) => req.request_id != request_id))
    }

    const handleAcceptRequest = (request_id: number) => {
        console.log('accept sent')
        acceptRequest(request_id)
        console.log('accepted')
        toast.success('Запрос одобрен!')
        handleDeleteRequest(request_id)
    }

    const handleCancelRequest = async (request_id: number, employee_id: number, justification: string) => {
        console.log('cancel sent')
        cancelRequest(request_id, employee_id, justification)
        console.log('cancel')
        toast.success('Запрос отклонен!')
        handleDeleteRequest(request_id)
    }

    const [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        refetch()
        // debugger
        // if (data) setRequests(data)
    }, [])

    useEffect(() => {
        if (data) setRequests(data)
    }, [data])

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Отклонить запрос</DialogTitle>
                        <DialogDescription>
                            Напишите обоснование отклонения запроса.
                        </DialogDescription>
                        <Textarea value={ justification } onChange={ (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setJustification(e.target.value)
                        } } placeholder="Обоснование отмены"></Textarea>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                        <Button 
                            variant="destructive"
                            onClick={() => {
                                handleCancelRequest(selectedRequestId, employeeId, justification)
                                setIsDialogOpen(false)
                            }}
                        >Отклонить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <TabsContent value="requests" className="space-y-6">
                <Card className="overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                    <CardTitle className="text-lg md:text-xl">Запросы вам</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Здесь вы можете узнать, кто отправлял вам запросы на повышение уровня компетенции.
                    </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {isFetching ? (
                    <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 animate-pulse">
                            <div className="flex items-center gap-3">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="w-40 h-4" />
                                <Skeleton className="w-36 h-3" />
                                <Skeleton className="w-28 h-3" />
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <Skeleton className="w-24 h-8 rounded-md" />
                            <Skeleton className="w-24 h-8 rounded-md" />
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="space-y-3 divide-y divide-border">
                        {requests && requests.map((rq) => {
                        const owner = rq.request_owner
                        const initials = owner ? `${owner.employee_name?.[0] ?? ""}${owner.employee_surname?.[0] ?? ""}` : ""
                        return (
                            <div
                            key={rq.request_id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-lg hover:shadow-sm transition-shadow bg-background"
                            >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={owner?.employee_photo ?? ""}
                                    alt="Profile"
                                />
                                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                <p className="font-semibold">{`${owner?.employee_name ?? "-"} ${owner?.employee_surname ?? ""}`}</p>
                                <p className="text-sm text-muted-foreground">{owner?.employee_email ?? "-"}</p>
                                <p className="text-sm mt-1">
                                    Компетенция:
                                    <span className="ml-2 inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-sm">
                                    {rq.request_skill?.skill_shape.skill_name ?? "-"}
                                    </span>
                                </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={() => handleAcceptRequest(rq.request_id)}>Одобрить</Button>
                                <Button onClick={() => { 
                                    setIsDialogOpen(true) 
                                    setSelectedRequestId(rq.request_id)
                                }} variant="destructive">Отклонить</Button>
                            </div>
                            </div>
                        )
                        })}
                    </div>
                    )}
                </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}