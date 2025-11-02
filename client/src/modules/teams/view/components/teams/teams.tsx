'use client'

import { useGetTeams } from "@/modules/teams/infrastructure/query/queries"
import { TeamsTable } from "../teams-table/teams-table"
import { useAuth } from "@/libs/providers/ability-provider"
import ProtectedRoute from "@/libs/protected-route"

export const Teams = () => {

    const {companyId} = useAuth()

    const {data, isLoading} = useGetTeams(companyId || 0)

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 animate-appear">
            <ProtectedRoute allowedRoles={['admin']}>
                <TeamsTable data={data || []} />
            </ProtectedRoute>
        </div>
    )
}