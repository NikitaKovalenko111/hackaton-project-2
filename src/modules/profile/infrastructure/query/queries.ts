import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../profile-api"

export const useGetProfile = () => {

    return useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    })
}