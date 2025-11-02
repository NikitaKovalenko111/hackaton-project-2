import { useQuery } from "@tanstack/react-query"
import { getProfile, getRequests } from "../profile-api"
const Cookies = require('js-cookie')

export const useGetProfile = () => {

    const token = Cookies.get("accessToken")

    return useQuery({
        queryKey: ['profile', token],
        queryFn: () => getProfile(),
        // retry: 2,
        // retryOnMount: true,
        enabled: !!token
    })
}

export const useGetRequests = () => {

    return useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequests(),
        enabled: false
    })
}