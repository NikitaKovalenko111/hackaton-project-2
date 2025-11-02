import { useTypedSelector } from "./useTypedSelector";

export const useReduxSocket = () => useTypedSelector(state => state.socket)