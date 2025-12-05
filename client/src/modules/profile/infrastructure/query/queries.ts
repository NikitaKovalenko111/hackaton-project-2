import { useQuery } from "@tanstack/react-query"
import { getProfile, getProfilePhoto, getRequests } from "../profile-api"
const Cookies = require('js-cookie')

export const useGetProfile = () => {

    const token = Cookies.get("accessToken")

    return useQuery({
        queryKey: ['profile', token],
        queryFn: () => getProfile(0, true),
        // retry: 2,
        // retryOnMount: true,
        enabled: !!token,
        staleTime: 0,
        gcTime: 0
    })
}

export const useGetProfilePhoto = (setter: (data: string) => void) => {

    return useQuery({
        queryKey: ['profilePhoto'],
        queryFn: () => getProfilePhoto(setter),
        enabled: true
    })
}

export const useGetRequests = () => {

    return useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequests(),
        enabled: false
    })
}