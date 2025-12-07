'use client'

import { useEffect, useState } from "react"
import { SkillOrdersTable } from "../skill-order-table/skill-order-table"
import { useGetSkillOrders } from "@/modules/skills/infrastructure/query/queries"

export const SkillOrder = () => {

    const [selectedSkillNames, setSelectedSkillNames] = useState<string[]>([])

    const handleChangeSkillNames = (names: string[]) => {
        setSelectedSkillNames(names)
    }

    const {data, refetch, isFetching} = useGetSkillOrders(selectedSkillNames)

    useEffect(() => {
        refetch()
    }, [selectedSkillNames])

    return (
        <div className="mx-auto animate-appear w-full max-w-6xl space-y-6 px-4 py-10">
            <SkillOrdersTable data={data || []} isFetching={isFetching} handleChangeSelectedSkills={handleChangeSkillNames} />
        </div>
    )
}