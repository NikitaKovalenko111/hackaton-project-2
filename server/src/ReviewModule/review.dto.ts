import { ApiProperty } from '@nestjs/swagger';

export class addQuestionBodyDto {
  @ApiProperty({ example: 'Как оцениваете коммуникацию коллеги?' })
  question_text: string

  @ApiProperty({ example: 5 })
  review_id: number
}

export class setReviewBodyDto {
  @ApiProperty({ example: 1 })
  review_id: number

  @ApiProperty({ example: 7, description: 'Интервал ревью в днях' })
  review_interval: number
}

export class sendedAnswer {
  @ApiProperty({ example: 'Отличная работа в команде' })
  answer_text: string

  @ApiProperty({ example: 12 })
  question_id: number
}

export class sendAnswersBodyDto {
  @ApiProperty({ type: [sendedAnswer] })
  answers: sendedAnswer[]

  @ApiProperty({ example: 3 })
  employee_id: number

  @ApiProperty({ example: 7 })
  employee_answers_to_id: number

  @ApiProperty({ example: 2 })
  company_id: number

  @ApiProperty({ example: 5 })
  review_id: number
}
