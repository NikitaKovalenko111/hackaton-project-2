import { useQuery } from "@tanstack/react-query"
import { getAllSkills, getSkillById } from "../skills-api"

export const useGetCompanySkills = () => {
    
    return useQuery({
        queryKey: ['skills'],
        queryFn: () => getAllSkills()
    })
}

export const useGetSkill = (id: number) => {

    return useQuery({
        queryKey: [`skill_${id}`],
        queryFn: () => getSkillById(id)
    })
}