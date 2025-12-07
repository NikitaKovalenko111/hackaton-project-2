'use client'

import { useQuery } from '@tanstack/react-query'
import { getTeamInfo, getTeams } from '../teams-api'

export const useGetTeams = (
    companyId: number,
    teamName: string = '',
    teamleadSurname: string = ''
) => {
    return useQuery({
        queryKey: ['teams', teamName, teamleadSurname],
        queryFn: () => getTeams(companyId, teamName, teamleadSurname),
    })
}

export const useGetTeamInfo = () => {
    return useQuery({
        queryKey: ['team-info'],
        queryFn: () => getTeamInfo(),
        enabled: false,
    })
}
