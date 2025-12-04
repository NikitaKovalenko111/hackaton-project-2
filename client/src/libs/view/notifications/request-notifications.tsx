'use client'

// import socket from "@/app/socket"
import { Request } from "@/libs/constants"
import { SocketContext, useSocket } from "@/libs/hooks/useSocket"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

export const RequestNotifications = () => {

    const {socket} = useContext(SocketContext)

    // const [requests, setRequests] = useState<Request[]>([])
    // const {socket} = useSocket()

    useEffect(() => {
        if (!socket) return

        const handleAcceptRequest = (request: Request) => {
            // setRequests(prev => [...prev.slice(0, 9), request])
            debugger
            toast("Запрос на повышение квалификации одобрен!", {
                description: <p>Ваш запрос на повышение квалификации компетенции одобрен!</p>,
                action: {
                    label: 'Понял',
                    onClick: () => {}
                },
                classNames: {
                    description: "!text-foreground/80"
                }
            })
        }

        const handleCancelRequest = (request: Request) => {
            // setRequests(prev => [...prev.slice(0, 9), request])
            debugger
            toast("Запрос на повышение квалификации отклонен!", {
                description: (
                    <div>
                        <p>Ваш запрос на повышение квалификации компетенции отклонен!</p>,
                        <p>Причина: {request.justification}</p>
                    </div>
                ),
                action: {
                    label: 'Понял',
                    onClick: () => {}
                },
                classNames: {
                    description: "!text-foreground/80"
                }
            })
        }

        socket.on('completedRequest', (request: Request) =>  {
            handleAcceptRequest(request)
        })

        socket.on('canceledRequest', (request: Request) => {
            handleCancelRequest(request)
        })

        return () => {
            socket!.off('completedRequest', (request: Request) => {
                handleAcceptRequest(request)
            })
            socket!.off('canceledRequest', (request: Request) => {
                handleCancelRequest(request)
            })
        }
    }, [socket])

    return (
        <div></div>
    )
}