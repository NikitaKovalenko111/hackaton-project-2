import { set } from 'zod';
import http from "@/libs/http/http"
import { AiPlanData, AiPlanDTO, AiReviewData, Employee } from "../domain/profile.types"
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

export const setProfilePhoto = async (file: File): Promise<string> => {

    const formData = new FormData()
    console.log(file);
    
    formData.append("file", file)

    const res = await http.post("employee/photo", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res.data.photoUrl
}

export const getAiReview = async (employeeId: number): Promise<AiReviewData> => {

    const res = await http.get(`ai/get/review/${employeeId}`, {})
    return res.data
}

export const getProfilePhoto = async (setter: (data: string) => void): Promise<string> => {

    const res = await http.get(`/profilePhotos/13.jpeg`, {})

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