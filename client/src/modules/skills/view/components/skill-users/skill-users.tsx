'use client'

import { useGetCompanyEmployees } from "@/modules/employees/infrastructure/query/queries"
import { EmployeeTable } from "@/modules/skills/domain/skills.types"
import { useEffect, useState } from "react"
import { SkillUsersTable } from "../skill-users-table/skill-users-table"
import { useAuth } from "@/libs/providers/ability-provider"

export const SkillUsers = ({id}: {id: number}) => {

    const {data} = useGetCompanyEmployees()

    const [users, setUsers] = useState<EmployeeTable[]>([])

    useEffect(() => {
        if (data) {
            setUsers(data.map((item) => ({
                employee_id: item.employee_id,
                employee_name: item.employee_name,
                employee_surname: item.employee_surname,
                role: item.role,
                skills: item.skills.filter((skill) => skill.skill_shape.skill_shape_id == id)
            })))
        }
    }, [data])

    const {companyId} = useAuth()

    return (
        <div className="mx-auto animate-appear w-full max-w-6xl space-y-4 md:space-y-6 px-2 sm:px-4 py-4 md:py-10">
            <SkillUsersTable companyId={companyId!} id={id} users={users} />
        </div>
    )

}