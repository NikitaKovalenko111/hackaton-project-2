'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { ROLE } from "../constants";
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries";
import { getProfile } from "@/modules/profile/infrastructure/profile-api";
import { saveRoleStorage } from "@/modules/auth/infrastructure/auth-token";
import { saveCompanyStorage } from "@/modules/company/infrastructure/company-storage";

interface RoleContextValue {
    role: ROLE,
    companyId: number | null
}

export const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export const RoleProvider = ({children}: {children: React.ReactNode}) => {
    const [role, setRole] = useState<ROLE>('developer')
    const [companyId, setCompanyId] = useState<number | null>(null)

    const {data} = useGetProfile()

    useEffect(() => {
        
        if (data?.role) {
            setRole(data.role.role_name)
            saveRoleStorage(data.role.role_name)
            if (data.company) {
                setCompanyId(data.company.company_id)
                saveCompanyStorage(data.company.company_id)
            }
        }
    }, [data])

    console.log(data)

    return (
        <RoleContext.Provider value={{companyId, role}}>
            {children}
        </RoleContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(RoleContext)

    if (context === undefined) {
        throw new Error('useAuth must be inside of a RoleProvider')
    }

    return context
}