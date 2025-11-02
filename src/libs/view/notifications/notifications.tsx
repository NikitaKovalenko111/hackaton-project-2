'use client'

import socket from "@/app/socket"
import { Request } from "@/libs/constants"
import { useSocket } from "@/libs/hooks/useSocket"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const Notifications = () => {

    // const [requests, setRequests] = useState<Request[]>([])
    // const {socket} = useSocket()

    useEffect(() => {
        if (!socket) return

        const handleNewRequest = (request: Request) => {
            // setRequests(prev => [...prev.slice(0, 9), request])
            toast("Запрос на повышение уровня!", {
                description: <div>
                    <p>Сотрудник: {request.request_owner.employee_name} {request.request_owner.employee_surname}</p>
                    <p>Email: {request.request_owner.employee_email}</p>
                    </div>,
                action: {
                    label: 'Понял',
                    onClick: () => {}
                },
                classNames: {
                    description: "!text-foreground/80"
                }
            })
        }

<<<<<<< Updated upstream
        socket.on('newRequest', (request: Request) =>  {
=======
        socket.on('newRequest', (request: Request, callback) =>  {
>>>>>>> Stashed changes
            handleNewRequest(request)
            callback({ status: "successful" })
        })

        socket.on('completedRequest', (request: Request, callback) =>  {
            handleNewRequest(request)
            callback({ status: "successful" })
        })

        return () => {
<<<<<<< Updated upstream
            socket!.off('newRequest', (request: Request) => {
=======
            socket.off('newRequest', (request: Request, callback) => {
>>>>>>> Stashed changes
                handleNewRequest(request)
                callback({ status: "successful" })
            })
        }
    }, [socket])

    return (
        <div></div>
    )
}