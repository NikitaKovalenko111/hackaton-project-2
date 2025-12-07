'use client'

import { useGetCompanySkills } from "@/modules/skills/infrastructure/query/queries"
import { SkillsTable } from "../skills-table/skills-table"
import { useEffect, useState } from "react"
import { SkillShape, SkillTable } from "@/modules/skills/domain/skills.types"
import { Input } from "@/components/ui/input"
import ProtectedRoute from "@/libs/protected-route"
import { Button } from "@/components/ui/button"

export const Skills = () => {
    const [skills, setSkills] = useState<SkillTable[]>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false) // Перенесено состояние

    const {data, isFetching} = useGetCompanySkills(Boolean(searchValue), searchValue)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
    }

    // Функции управления диалогом
    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false)
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
        <div className="w-full max-w-6xl space-y-6 px-4 py-10 animate-appear">
            <ProtectedRoute allowedRoles={['admin', 'teamlead']}>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <Input 
                        value={searchValue} 
                        onChange={onChange} 
                        placeholder="Название компетенции" 
                        className="flex-1 max-w-[300px]"
                    />
                    <Button 
                        onClick={handleOpenCreateDialog} 
                        variant="default"
                        className="w-full sm:w-auto"
                    >
                        Добавить компетенцию
                    </Button>
                </div>
                
                <SkillsTable 
                    isFetching={isFetching} 
                    data={skills} 
                    openCreateDialog={openCreateDialog}
                    onCloseCreateDialog={handleCloseCreateDialog}
                />
            </ProtectedRoute>
        </div>
    )
}