'use cleint'

import { useEffect, useState } from "react"
import { ROLE } from "./constants"
import { useAuth } from "./providers/ability-provider"
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries"

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: ROLE[]
}

export default function ProtectedRoute({children, allowedRoles=['developer', 'admin', 'hr', 'moderator', 'teamlead', 'techlead']}: ProtectedRouteProps) {
    
    // const {role} = useAuth()

    const [role, setRole] = useState<ROLE | ''>('')

    const {data, refetch} = useGetProfile()

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        if (data && data.role) setRole(data.role.role_name)
    }, [data])
    
    if (role && allowedRoles.includes(role)) return children

    return null
}