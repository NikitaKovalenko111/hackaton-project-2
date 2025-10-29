'use client'

import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useActions } from './useActions';
import { useReduxSocket } from './useReduxSocket';
const Cookies = require("js-cookie")

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const reduxSocket = useReduxSocket()
    const {setSocket: setReduxSocket} = useActions()

    useEffect(() => {

    const token = Cookies.get("accessToken")
    
    if (!token) {
        if (socket || reduxSocket) {
            if (socket) socket.disconnect()
            setReduxSocket({socket: null})
        }
        return 
    }

    if (reduxSocket.socket) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        withCredentials: true,
        extraHeaders: {
            authorization: `Bearer ${token}`,
            client_type: 'web',

        },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
        console.log('socket connected')
    })

    newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

    const originalEmit = newSocket.emit.bind(newSocket);
        newSocket.emit = (event: string, ...args: any[]) => {
            console.log('📤 Emitting event:', event, 'with data:', args);
            return originalEmit(event, ...args);
        };

    setReduxSocket({socket: newSocket})
    setSocket(newSocket)

    return () => {
        newSocket.disconnect();
    }}, []);

    // const handleSendRequest = useCallback( (
    //     requestType: 'upgrade',
    //     employeeId: number,
    //     skill_id: number
    // ) => {
        
    //     if (!reduxSocket.socket) {
    //         return Promise.reject(new Error('Socket is not connected'))
    //     }

    //     return new Promise(() => {
    //         reduxSocket.socket!.timeout(15000).emit('addRequest', {
    //             requestType, 
    //             employeeId,
    //             skill_id
    //         })
    //     })
    // }, [reduxSocket.socket])

    const handleSendRequest = (requestType: 'upgrade', employeeId: number, skill_id: number) => {
        reduxSocket.socket!.timeout(5000).emit('addRequest', {
                requestType, 
                employeeId,
                skill_id
            })
    }

    const acceptRequest = useCallback(async (
        request_id: number
    ) => {
        if (!reduxSocket.socket) {
            return Promise.reject(new Error('Socket is not connected'))
        }

        return new Promise(() => {
            reduxSocket.socket!.timeout(15000).emit('completeRequest', {request_id})
        })
    }, [reduxSocket.socket])

    const cancelRequest = useCallback(async (
        request_id: number,
        employee_id: number
    ) => {
        if (!reduxSocket.socket) {
            return Promise.reject(new Error('Socket is not connected'))
        }

        return new Promise(() => {
            reduxSocket.socket!.timeout(5000).emit('cancelRequest', {
                request_id,
                employee_id
            })
        })
    }, [reduxSocket.socket])

    return {
        socket,
        handleSendRequest,
        acceptRequest,
        cancelRequest
    };
};