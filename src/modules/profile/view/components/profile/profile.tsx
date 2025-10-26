'use client'

import { useEffect, useState } from "react"
import { ProfileContent } from "../profile-content/profile-content"
import { ProfileHeader } from "../profile-header/profile-header"
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries"
import { SkeletonHeader } from "../../ui/skeleton-header"
import { SkeletonContent } from "../../ui/skeleton-content"

export const Profile = () => {

    const {data, isSuccess, isError, isPending} = useGetProfile()

    console.log(data)

    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
            {isPending || isError ? 
                <SkeletonHeader /> : 
                <ProfileHeader  
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
            {isPending || isError ? 
                <SkeletonContent /> : 
                <ProfileContent 
                    employee_email={data.employee_email}
                    employee_name={data.employee_name}
                    employee_status={data.employee_status}
                    employee_surname={data.employee_surname}
                    skills={data.skills}
                />
            }
        </div>
    )
}