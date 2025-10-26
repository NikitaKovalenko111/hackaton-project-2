import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateSkillDTO, GiveSkillDTO } from "../../domain/skills.types"
import { createSkill, giveSkill, removeSkill } from "../skills-api"
import toast from "react-hot-toast"

export const useCreateSkill = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["skills-create"],
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

export const useGiveSkill = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["give-skill"],
        mutationFn: (data: GiveSkillDTO) => giveSkill(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] })
            toast.success('Компетенция выдана сотруднику!')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}

export const useRemoveSkill = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["remove-skill"],
        mutationFn: (id: number) => removeSkill(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] })
            toast.success('Компетенция удалена у сотрудника!')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}