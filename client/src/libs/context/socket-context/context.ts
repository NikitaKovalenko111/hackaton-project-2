import { createContext } from 'react'

export const SocketContext = createContext({
    queueLength: 0,
    positionInLine: 0,
})
