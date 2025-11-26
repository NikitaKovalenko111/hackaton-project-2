import { useQuery } from "@tanstack/react-query"
import { getAllSkills, getSkillById, getSkillOrders } from "../skills-api"

export const useGetCompanySkills = (enabled?: boolean) => {
    
    return useQuery({
        queryKey: ['skills'],
        queryFn: () => getAllSkills(),
        enabled: enabled ? enabled : true
    })
}

export const useGetSkill = (id: number) => {

    return useQuery({
        queryKey: [`skill_${id}`],
        queryFn: () => getSkillById(id)
    })
}

export const useGetSkillOrders = (skillNames: string[]) => {

    return useQuery({
        queryKey: ['skill_orders'],
        queryFn: () => getSkillOrders(skillNames),
        enabled: false
    })
}