import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InterviewDTO } from "../../domain/interviews.types"
import { addInterview } from "../interviews-api"
import toast from "react-hot-toast"

export const useAddInterview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["create-interview"],
        mutationFn: (data: InterviewDTO) => addInterview(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] })
            setTimeout(() => {
                toast.success('Собеседование добавлено!')
            }, 1000)
        },
        onError: (error) => {
            toast.error('Возникла ошибка!')
            // toast.error(error.message)
        }
    })
}