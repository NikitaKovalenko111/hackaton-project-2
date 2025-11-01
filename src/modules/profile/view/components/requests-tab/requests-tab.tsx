import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsContent } from "@/components/ui/tabs"
import { Request } from "@/libs/constants"
import { useSocket } from "@/libs/hooks/useSocket"
import { useGetRequests } from "@/modules/profile/infrastructure/query/queries"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const RequestsTab = () => {

    const {data, refetch, isFetching} = useGetRequests()
    const {acceptRequest, cancelRequest} = useSocket()

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

    const handleCancelRequest = async (request_id: number, employee_id: number) => {
        console.log('cancel sent')
        await cancelRequest(request_id, employee_id)
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
        <TabsContent value="requests" className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Запросы вам</CardTitle>
                <CardDescription>
                    Здесь вы можете узнать, кто отправлял вам запросы на повышение уровня компетенции.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isFetching ? (
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-20 h-4" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="w-25 h-6" />
                            <Skeleton className="w-25 h-6" />
                        </div>
                    </div>
                ) : (
                    <>
                        {requests && requests.map((rq, id) => {
                            return (
                                <div key={id} className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage
                                                src={rq.request_owner ? rq.request_owner.employee_photo : ''}
                                                alt="Profile"
                                            />
                                            <AvatarFallback className="text-2xl">{`${rq.request_owner.employee_name[0]}${rq.request_owner.employee_surname[0]}`}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p>{`${rq.request_owner.employee_name} ${rq.request_owner.employee_surname}`}</p>
                                            <p>Email: {rq.request_owner.employee_email}</p>
                                            <p>Компетенция: {rq.request_skill?.skill_shape.skill_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleAcceptRequest(rq.request_id)}>Одобрить</Button>
                                        <Button onClick={() => handleCancelRequest(rq.request_id, rq.request_owner.employee_id)} variant="destructive">Отклонить</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}
            </CardContent>
            </Card>
        </TabsContent>
    )
}