
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { socketSlice } from './slices/socket.slice'

const combindedReducers = combineReducers({
  socket: socketSlice.reducer
})

export const makeStore = () => {
  return configureStore({
    reducer: combindedReducers,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActuibs: ['socket/setSocket'],
          ignoredActionPaths: ['payload.socket'],
          ignoredPaths: ['payload.socket', 'socket.socket']
        }
      })
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export type TypeRootState = ReturnType<typeof combindedReducers>