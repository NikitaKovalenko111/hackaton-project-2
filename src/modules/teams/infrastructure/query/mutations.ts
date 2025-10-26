'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AddTeamDTO } from "../../domain/teams.type"
import { addTeam } from "../teams-api"
import toast from "react-hot-toast"

export const useCreateTeam = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["teams"],
        mutationFn: (data: AddTeamDTO) => addTeam(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            toast.success('Команда добавлена!')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}