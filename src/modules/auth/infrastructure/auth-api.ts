import http from "@/libs/http/http";
import { AuthData, AuthLoginDTO, AuthSignupDTO } from "../domain/auth.type";
import { saveRefreshStorage, saveTokenStorage } from "./auth-token";

export const register = async (data: AuthSignupDTO): Promise<AuthData> => {
    const res = await http.post('employee/registration', data, {})
    
    if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
    if (res.data.refreshToken) saveRefreshStorage(res.data.refreshToken)
    
    return res.data
}

export const login = async (data: AuthLoginDTO): Promise<AuthData> => {
    const res = await http.post('employee/authorization', data, {})
    
    if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
    if (res.data.refreshToken) saveRefreshStorage(res.data.refreshToken)
    
    return res.data
}