'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { io, Socket } from 'socket.io-client'
import { useActions } from './useActions'
import { useReduxSocket } from './useReduxSocket'
// import socket from '@/app/socket';
const Cookies = require('js-cookie')

export const SocketContext = createContext<{
    socket: Socket | null
    resetSocket: () => void
    regSocket: () => void
}>({
    socket: null,
    resetSocket: () => {},
    regSocket: () => {},
})

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [log, setLog] = useState<boolean>(false)

    const resetSocket = () => {
        if (socket) socket.disconnect()
        setSocket(null)
        setLog((prev) => !prev)
    }

    const regSocket = () => {
        setLog((prev) => !prev)
    }

    // const connectSocket = () => {
    //     if (!socket) {
    //         const sk =
    //     }
    // }

    useEffect(() => {
        const token = Cookies.get('accessToken', { domain: process.env.DOMAIN })

        if (!token) {
            if (socket) {
                socket.disconnect()
                setSocket(null)
            }
            return
        } else {
            const sk = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                withCredentials: true,
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                    client_type: 'web',
                },
                reconnection: false,
            })
            setSocket(sk)
        }

        socket?.on('connect', () => {
            console.log('Socket ID: ', socket.id)
        })

        return () => {
            socket?.off('connect', () => {
                console.log('Socket ID: ', socket.id)
            })
            socket?.disconnect()
            setSocket(null)
        }
    }, [log])

    return (
        <SocketContext.Provider value={{ socket, resetSocket, regSocket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const { socket: socketInstance } = useContext(SocketContext)

    useEffect(() => {
        if (!socketInstance) return

        const token = Cookies.get('accessToken')
        if (!token) {
            console.log('No token, disconnecting existing socket')
            if (socketInstance) {
                // let sk: Socket = socketInstance as Socket
                // sk.disconnect()
                socketInstance.disconnect()
            }
            return
        }

        socketInstance.on('connect', () => {
            console.log('Socket connected, ID:', socketInstance.id)
        })

        return () => {
            socketInstance.off('connect', () => {
                console.log('Socket connected, ID:', socketInstance.id)
            })
        }
    }, [socketInstance])

    const handleSendRequest = (
        requestType: 'upgrade',
        employeeId: number,
        skill_id: number
    ) => {
        socketInstance!.timeout(5000).emit('addRequest', {
            requestType,
            employeeId,
            skill_id,
        })
    }

    const acceptRequest = (request_id: number) => {
        if (!socketInstance) {
            return
        }

        socketInstance.timeout(5000).emit('completeRequest', { request_id })
    }

    const cancelRequest = (
        request_id: number,
        employee_id: number,
        justification: string
    ) => {
        if (!socketInstance) {
            return
        }
        socketInstance.timeout(5000).emit('cancelRequest', {
            request_id,
            employee_id,
            justification,
        })
    }

    return {
        // socket,
        handleSendRequest,
        acceptRequest,
        cancelRequest,
    }
}
