import http from "@/libs/http/http"
import { AiPlanData, AiPlanDTO, Employee } from "../domain/profile.types"
import { Request } from "@/libs/constants"
// import socket from "@/app/socket"
const Cookies = require('js-cookie')

export const getProfile = async (id: number, isCurrentEmployee: boolean): Promise<Employee> => {
    let res = null
    
    if (isCurrentEmployee) {
        res = await http.get(`employee/profile`, {})
        console.log(isCurrentEmployee);
    } else {
        res = await http.get(`employee/profile/${id}`, {})
    }

    return res.data
}

export const logout = async () => {

    const res = await http.post("employee/logout", {}, {
        withCredentials: true
    })
    debugger

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('role')
    Cookies.remove('companyId')

    return res.data
}

export const getTeam = async () => {

    const res = await http.get("team/info", {})

    return res.data
}

export const getRequests = async (): Promise<Request[]> => {
    const res = await http.get("request/received/getAll", {})

    return res.data
}

export const requestAiPlan = async (data: AiPlanDTO): Promise<AiPlanData> => {
    const res = await http.post("ai/get/plan", data)
    
    return res.data
}