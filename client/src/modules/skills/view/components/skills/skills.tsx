'use client'

import { useGetCompanySkills } from "@/modules/skills/infrastructure/query/queries"
import { SkillsTable } from "../skills-table/skills-table"
import { useEffect, useState } from "react"
import { SkillShape, SkillTable } from "@/modules/skills/domain/skills.types"
import { Input } from "@/components/ui/input"
import ProtectedRoute from "@/libs/protected-route"

export const Skills = () => {

    const [skills, setSkills] = useState<SkillTable[]>([])
    const [searchValue, setSearchValue] = useState<string>('')

    const {data, isFetching} = useGetCompanySkills(Boolean(searchValue), searchValue)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        
        setSearchValue(value)
    }

    useEffect(() => {
        if (data) {
            const items: SkillTable[] = data.map((item: SkillShape) => ({
                skill_name: item.skill_name,
                skill_desc: item.skill_desc,
                skill_count: item.skills ? item.skills.length : 0,
                skill_shape_id: item.skill_shape_id
            }))
            setSkills(items)
        }
    }, [data])

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 animate-appear">
            <ProtectedRoute allowedRoles={['admin', 'teamlead']}>
                <Input value={searchValue} onChange={onChange} placeholder="Название компетенции"></Input>
                <SkillsTable isFetching={isFetching} data={skills} />
            </ProtectedRoute>
        </div>
    )
}