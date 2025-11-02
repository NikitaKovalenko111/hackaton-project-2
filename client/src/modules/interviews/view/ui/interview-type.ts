import { InterviewType } from "../../domain/interviews.types";

export const getInterviewType = (type: InterviewType) => {

    switch (type) {
        case 'case': return "Кейс"
        case 'hr': return 'HR'
        case 'soft': return 'Софт'
        case 'tech': return 'Тех'
    }
}