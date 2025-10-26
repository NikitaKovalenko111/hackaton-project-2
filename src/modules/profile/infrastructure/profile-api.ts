import http from "@/libs/http/http"
import { Employee } from "../domain/profile.types"
const Cookies = require('js-cookie')

export const getProfile = async (): Promise<Employee> => {
    const res = await http.get('employee/profile', {})

    return res.data
}

export const logout = async () => {

    const res = await http.post("employee/logout", {}, {
        withCredentials: true
    })

    if (res.status == 201) {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('role')
        Cookies.remove('companyId')
    }

    return res.data
}