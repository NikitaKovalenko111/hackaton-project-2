import { DialogContent } from '@/components/ui/dialog'
import { InterviewDTO } from '@/modules/interviews/domain/interviews.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const zodSchema = z.object({
    interview_subject: z.number(),
    interview_date: z.date({ message: 'Дата собеседования обязательна' }),
    interview_desc: z.string(),
    interview_type: z
        .string()
        .refine((data) => ['tech', 'soft', 'hr', 'case'].includes(data))
        .min(1, { message: 'Выберите тип собеседования' }),
})

export const CreateInterviewDialog = () => {
    // const {

    //     handleSubmit,
    //     control,
    //     formState: {errors},
    //     reset

    // } = useForm<InterviewDTO>({
    //     resolver: zodResolver(zodSchema),
    //     mode: 'onChange',
    //     defaultValues: {
    //         interview_date: new Date(),
    //         interview_desc: '',
    //         interview_subject: 0,
    //         interview_type: 'case'
    //     }
    // })

    return <DialogContent></DialogContent>
}
