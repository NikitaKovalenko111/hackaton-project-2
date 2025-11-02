'use client'

import { useQuery } from "@tanstack/react-query"
import { getTeamInfo, getTeams } from "../teams-api"

export const useGetTeams = (companyId: number) => {

    return useQuery({
        queryKey: ['teams'],
        queryFn: () => getTeams(companyId)
    })
}

export const useGetTeamInfo = () => {

    return useQuery({
        queryKey: ['team-info'],
        queryFn: () => getTeamInfo(),
        enabled: false
    })
}