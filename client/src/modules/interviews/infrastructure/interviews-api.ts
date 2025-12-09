import http from '@/libs/http/http'
import { InterviewData, InterviewDTO } from '../domain/interviews.types'

export const addInterview = async (
    data: InterviewDTO
): Promise<InterviewData> => {
    const newData = {
        interview_subject: Number(data.interview_subject),
        interview_date: data.interview_date,
        interview_type: data.interview_type,
        interview_desc: data.interview_desc,
    }

    const res = await http.post('interview/add', newData)

    return res.data
}

export const getInterviewPlanned = async (): Promise<InterviewData[]> => {
    const res = await http.get('interview/get', {})
    debugger
    return res.data
}

export const finishInterview = async (
    id: number,
    comment: string,
    duration: number
): Promise<InterviewData> => {
    const res = await http.post('interview/finish', {
        interview_id: id,
        interview_comment: comment,
        interview_duration: duration,
    })
    return res.data
}
