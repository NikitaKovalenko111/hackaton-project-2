import http from "@/libs/http/http";
import { CreateSkillDTO, GiveSkillDTO, SkillShape } from "../domain/skills.types";

export const getAllSkills = async (): Promise<SkillShape[]> => {
    const res = await http.get('company/skills', {})

    return res.data
}

export const createSkill = async (data: CreateSkillDTO) => {
    const res = await http.post("company/skill/create", data)
    debugger
    return res.data
}

export const getSkillById = async (id: number): Promise<SkillShape> => {
    const res = await http.get(`skill/skillShape/${id}`, {})

    return res.data
}


export const giveSkill = async (data: GiveSkillDTO) => {
    const res = await http.post("company/skill/give", data)

    return res.data
}

export const removeSkill = async (id: number) => {
    await http.remove(`skill/${id}/delete`, {})
}

export const removeSkillFromCompany = async (id: number) => {
    await http.remove(`company/skillShape/remove/${id}`, {})
}