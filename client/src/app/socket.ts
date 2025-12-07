'use client'

import { io, Socket } from 'socket.io-client'
const Cookies = require('js-cookie')

// const URL = "http://176.119.147.135:3001/"

const token = Cookies.get('accessToken')
debugger

let socket: Socket | null = null

// export const socket = token ? io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//         withCredentials: true,
//         extraHeaders: {
//             authorization: `Bearer ${token}`,
//             client_type: 'web',
//         },
//     reconnection: false}) : null

if (token) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        withCredentials: true,
        extraHeaders: {
            authorization: `Bearer ${token}`,
            client_type: 'web',
        },
        reconnection: false,
    })
} else {
    socket = null
}

// export default socket
