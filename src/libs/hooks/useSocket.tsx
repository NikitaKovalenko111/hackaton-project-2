'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useActions } from './useActions';
import { useReduxSocket } from './useReduxSocket';
import socket from '@/app/socket';
const Cookies = require("js-cookie")

const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    // const [socket, setSocket] = useState<Socket | null>(null);

    const socketInstance = useContext(SocketContext)

    // const reduxSocket = useReduxSocket()
    // const {setSocket: setReduxSocket} = useActions()

    // useEffect(() => {
    // const token = Cookies.get("accessToken")
    // if (!token) {
    //     console.log(reduxSocket)
    //     if (socket || reduxSocket.socket) {
    //         if (socket) socket.disconnect()
    //         setReduxSocket({socket: null})
    //     }

    //     return 
    // }

    // if (reduxSocket.socket) return

    // const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    //     withCredentials: true,
    //     extraHeaders: {
    //         authorization: `Bearer ${token}`,
    //         client_type: 'web',

    //     },
    //     autoConnect: true,
    //     reconnection: true,
    //     reconnectionAttempts: 5,
    //     reconnectionDelay: 1000
    // });

    // newSocket.on('connect', () => {
    //     console.log('Socket connected, ID:', newSocket.id, 'Reconnected:', newSocket.connected);
    // });

    // newSocket.on('error', (error) => {
    //         console.error('Socket error:', error);
    //     });

    // const originalEmit = newSocket.emit.bind(newSocket);
    //     newSocket.emit = (event: string, ...args: any[]) => {
    //         console.log('📤 Emitting event:', event, 'with data:', args);
    //         return originalEmit(event, ...args);
    //     };

    // setReduxSocket({socket: newSocket})
    // setSocket(newSocket)

    // return () => {
    //     newSocket.disconnect();
    //     setSocket(null)
    //     setReduxSocket({socket: null})
    // }}, []);

    useEffect(() => {
    if (!socketInstance) return;

    const token = Cookies.get("accessToken");
    if (!token) {
        console.log('No token, disconnecting existing socket');
        if (socketInstance) {
            // let sk: Socket = socketInstance as Socket
            // sk.disconnect()
            socketInstance.disconnect()
        };
        return;
    }

    socketInstance.on('connect', () => {
        console.log('Socket connected, ID:', socketInstance.id);
    });

    // newSocket.on('error', (error) => {
    //     console.error('Socket error:', error);
    // });

    // const originalEmit = socke.emit.bind(newSocket);
    // newSocket.emit = (event: string, ...args: any[]) => {
    //     console.log('📤 Emitting event:', event, 'with data:', args);
    //     return originalEmit(event, ...args);
    // };

    // setReduxSocket({ socket: newSocket });
    // setSocket(newSocket);

    return () => {
        // console.log('Cleaning up socket');
        // newSocket.disconnect();
        // setSocket(null);
        // setReduxSocket({ socket: null });
        socketInstance.off('connect', () => {
            console.log('Socket connected, ID:', socketInstance.id);
        })
    };
}, [socketInstance]);


    const handleSendRequest = (requestType: 'upgrade', employeeId: number, skill_id: number) => {
        socketInstance!.timeout(5000).emit('addRequest', {
                requestType, 
                employeeId,
                skill_id
            })
    }

    const acceptRequest = (
        request_id: number
    ) => {
        if (!socketInstance) {
            return
        }
        
        socketInstance.timeout(5000).emit('completeRequest', {request_id})
    }

    const cancelRequest = (
        request_id: number,
        employee_id: number
    ) => {
        if (!socketInstance) {
            return 
        }
        socketInstance.timeout(5000).emit('cancelRequest', {
            request_id,
            employee_id
        })
    }

    return {
        socket,
        handleSendRequest,
        acceptRequest,
        cancelRequest
    };
};