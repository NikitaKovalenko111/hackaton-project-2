import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateSkillDTO } from "../../domain/skills.types"
import { createSkill } from "../skills-api"
import toast from "react-hot-toast"

export const useCreateSkill = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["skills"],
        mutationFn: (data: CreateSkillDTO) => createSkill(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] })
            toast.success('Компетенция добавлена!')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}