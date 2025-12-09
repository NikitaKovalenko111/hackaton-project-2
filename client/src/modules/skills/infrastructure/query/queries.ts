import { useQuery } from '@tanstack/react-query'
import { getAllSkills, getSkillById, getSkillOrders } from '../skills-api'

export const useGetCompanySkills = (enabled?: boolean, name: string = '') => {
    console.log(name)

    const result = useQuery({
        queryKey: ['skills', name],
        queryFn: () => getAllSkills(name),
        enabled: enabled ? enabled : true,
    })

    return result
}

export const useGetSkill = (id: number) => {
    return useQuery({
        queryKey: [`skill_${id}`],
        queryFn: () => getSkillById(id),
    })
}

export const useGetSkillOrders = (skillNames: string[]) => {
    return useQuery({
        queryKey: ['skill-orders'],
        queryFn: () => getSkillOrders(skillNames),
        enabled: false,
    })
}
