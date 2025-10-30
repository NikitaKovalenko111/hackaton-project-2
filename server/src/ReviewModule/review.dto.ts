export interface addQuestionBodyDto {
  question_text: string
  review_id: number
}

export interface setReviewBodyDto {
  review_id: number
  review_interval: number
}

export interface sendedAnswer {
  answer_text: string
  question_id: number
}

export interface sendAnswersBodyDto {
  answers: sendedAnswer[]
  employee_id: number
  employee_answers_to_id: number
  company_id: number
  review_id: number
}
