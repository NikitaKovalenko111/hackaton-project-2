import http from "@/libs/http/http";
import { AuthData, AuthLoginDTO, AuthSignupDTO, Payload } from "../domain/auth.type";
import { saveRefreshStorage, saveRoleStorage, saveTokenStorage } from "./auth-token";
import { saveCompanyStorage } from "@/modules/company/infrastructure/company-storage";

export const register = async (data: AuthSignupDTO): Promise<AuthData> => {
    const res = await http.post('employee/registration', data, {})

    if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
    if (res.data.refreshToken) saveRefreshStorage(res.data.refreshToken)
    
    return res.data
}

export const login = async (data: AuthLoginDTO): Promise<AuthData> => {
    const res = await http.post('employee/authorization', data, {})

    const user: Payload = res.data.payload

    if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
    if (res.data.refreshToken) saveRefreshStorage(res.data.refreshToken)
    if (user.role.role_name) saveRoleStorage(user.role.role_name)
    if (user.company.company_id) saveCompanyStorage(user.company.company_id)
    
    return res.data
}

export const refreshToken = async (): Promise<AuthData> => {
    
    const res = await http.get('employee/refresh', {
        withCredentials: true,
    })
    
    if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
    if (res.data.refreshToken) saveRefreshStorage(res.data.refreshToken)

    return res.data
}