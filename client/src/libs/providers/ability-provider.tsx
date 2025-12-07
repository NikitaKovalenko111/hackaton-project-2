'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ROLE } from '../constants'
import { useGetProfile } from '@/modules/profile/infrastructure/query/queries'
import { getProfile } from '@/modules/profile/infrastructure/profile-api'
import { saveRoleStorage } from '@/modules/auth/infrastructure/auth-token'
import { saveCompanyStorage } from '@/modules/company/infrastructure/company-storage'
const Cookies = require('js-cookie')

interface RoleContextValue {
    role: ROLE
    companyId: number | null
}

export const RoleContext = createContext<RoleContextValue | undefined>(
    undefined
)

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState<ROLE>('developer')
    const [companyId, setCompanyId] = useState<number | null>(null)

    const { data, refetch } = useGetProfile()
    // const [data, setData] = useState<RoleContextValue | null>(null)

    // const fetchData = async () => {
    //     const res = await getProfile()
    //     debugger
    //     setData({
    //         companyId: res.company && res.company.company_id ? res.company.company_id : 0,
    //         role: res.role ? res.role.role_name : 'developer'
    //     })
    // }

    // useEffect(() => {
    //     fetchData()
    // }, [])

    useEffect(() => {
        const token = Cookies.get('accessToken')
        if (token) refetch()
    }, [refetch])

    // useEffect(() => {
    //     const role = Cookies.get("role")
    //     const compId = Cookies.get("companyId")

    //     setData({
    //         companyId: compId,
    //         role: role
    //     })
    // }, [])

    useEffect(() => {
        if (data?.role) {
            setRole(data.role.role_name)
            saveRoleStorage(data.role.role_name)
            if (data.company) {
                setCompanyId(data.company.company_id)
                saveCompanyStorage(data.company.company_id)
            }
        }
        // if (data?.role) {
        //     setRole(data.role)
        //     saveRoleStorage(data.role)
        //     if (data.companyId) {
        //         setCompanyId(data.companyId)
        //         saveCompanyStorage(data.companyId)
        //     }
        // }
    }, [data])

    return (
        <RoleContext.Provider value={{ companyId, role }}>
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
