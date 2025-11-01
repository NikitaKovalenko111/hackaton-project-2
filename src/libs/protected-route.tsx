'use cleint'

import { ROLE } from "./constants"
import { useAuth } from "./providers/ability-provider"

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: ROLE[]
}

export default function ProtectedRoute({children, allowedRoles=['developer', 'admin', 'hr', 'moderator', 'teamlead', 'techlead']}: ProtectedRouteProps) {
    const {role} = useAuth()
    if (allowedRoles.includes(role)) return children

    return null
}