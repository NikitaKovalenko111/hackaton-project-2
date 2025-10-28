import { useQuery } from "@tanstack/react-query"
import { getProfile, getRequests } from "../profile-api"

export const useGetProfile = () => {

    return useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    })
}

export const useGetRequests = () => {

    return useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequests(),
        enabled: false
    })
}