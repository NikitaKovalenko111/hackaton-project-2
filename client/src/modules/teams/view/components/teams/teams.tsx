'use client'

import { useGetTeams } from "@/modules/teams/infrastructure/query/queries"
import { TeamsTable } from "../teams-table/teams-table"
import { useAuth } from "@/libs/providers/ability-provider"
import ProtectedRoute from "@/libs/protected-route"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export const Teams = () => {
    
    const {companyId} = useAuth() 

    const [searchValue, setSearchValue] = useState<string>('')
    const [teamleadSurname, setTeamleadSurname] = useState<string>('')

    const {data, isLoading} = useGetTeams(companyId || 0, searchValue, teamleadSurname)

    const onChangeTeam = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        
        setSearchValue(value)
    }

    const onChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        
        setTeamleadSurname(value)
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 animate-appear">
            <ProtectedRoute allowedRoles={['admin']}>
                <div className="flex gap-4">
                    <Input value={searchValue} onChange={onChangeTeam} placeholder="Название команды"></Input>
                    <Input value={teamleadSurname} onChange={onChangeSurname} placeholder="Фамилия тимлида"></Input>
                </div>
                <TeamsTable data={data || []} />
            </ProtectedRoute>
        </div>
    )
}