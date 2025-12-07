'use client'

import { useEffect, useState } from 'react'
import { SkillOrdersTable } from '../skill-order-table/skill-order-table'
import { useGetSkillOrders } from '@/modules/skills/infrastructure/query/queries'

export const SkillOrder = () => {
    const [selectedSkillNames, setSelectedSkillNames] = useState<string[]>([])

    const handleChangeSkillNames = (names: string[]) => {
        setSelectedSkillNames(names)
    }

    const { data, refetch, isFetching } = useGetSkillOrders(selectedSkillNames)

    useEffect(() => {
        refetch()
    }, [selectedSkillNames])

    return (
<<<<<<< HEAD
        <div className="mx-auto animate-appear w-full max-w-6xl space-y-6 px-4 py-10">
            <SkillOrdersTable
                data={data || []}
                isFetching={isFetching}
                handleChangeSelectedSkills={handleChangeSkillNames}
            />
=======
        <div className="mx-auto animate-appear w-full max-w-6xl space-y-6 px-4 py-10" data-testid="skill-orders-page">
            <SkillOrdersTable data={data || []} isFetching={isFetching} handleChangeSelectedSkills={handleChangeSkillNames} />
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
        </div>
    )
}
