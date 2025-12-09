import { createSlice } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'
import { PayloadAction } from '@reduxjs/toolkit'

interface SocketInitialState {
    socket: Socket | null
}

const initialState: SocketInitialState = {
    socket: null,
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<SocketInitialState>) => {
            state.socket = action.payload.socket as any
        },
    },
})
