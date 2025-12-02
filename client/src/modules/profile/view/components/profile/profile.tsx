'use client'

import { JSX, useEffect, useState } from "react"
import { ProfileContent } from "../profile-content/profile-content"
import { ProfileHeader } from "../profile-header/profile-header"
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries"
import { SkeletonHeader } from "../../ui/skeleton-header"
import { SkeletonContent } from "../../ui/skeleton-content"
import { Employee } from "@/modules/profile/domain/profile.types"
import { getProfile } from "@/modules/profile/infrastructure/profile-api"
import { useParams } from "next/navigation"
const Cookies = require('js-cookie')

type PropsType = {
    id: number
    isCurrentEmployee: boolean
}

export const Profile: React.FC<PropsType> = ({id, isCurrentEmployee}): JSX.Element => {
    const [data, setData] = useState<Employee | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    console.log(id);
    
    // const {data: profileData, isSuccess, isError, isPending, isRefetching, refetch} = useGetProfile()

    const fetchData = async (id: number) => {
        setLoading(true)
        const res = await getProfile(id, isCurrentEmployee)
        setData(res)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(id)
    }, [])

    // useEffect(() => {
    //     debugger
    //     if (profileData) setData(profileData)
    // }, [isRefetching])
    
    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
            {loading || !data ? 
                <SkeletonHeader /> : 
                <ProfileHeader
                    isCurrentEmployee={isCurrentEmployee}
                    employee_email={data.employee_email}
                    employee_id={data.employee_id}
                    employee_name={data.employee_name}

                    employee_password={data.employee_password}
                    employee_photo={data.employee_photo}
                    employee_status={data.employee_status}
                    employee_surname={data.employee_surname}
                    telegram_id={data.telegram_id}
                    role={data.role}
                    company={data.company}
                    team={data.team}
                    skills={data.skills}
                />
            }
            {loading || !data ? 
                <SkeletonContent /> : 
                <ProfileContent
                    isCurrentEmployee={isCurrentEmployee}
                    id={data.employee_id}
                    employee_email={data.employee_email}
                    employee_name={data.employee_name}
                    employee_status={data.employee_status}
                    employee_surname={data.employee_surname}
                    skills={data.skills}
                    team={data.team}
                />
            }
        </div>
    )
}