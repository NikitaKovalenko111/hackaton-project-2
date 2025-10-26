'use client'

import { useQuery } from "@tanstack/react-query"
import { getTeams } from "../teams-api"

export const useGetTeams = (companyId: number) => {

    return useQuery({
        queryKey: ['teams'],
        queryFn: () => getTeams(companyId)
    })
}