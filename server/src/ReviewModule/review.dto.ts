import { ApiProperty } from '@nestjs/swagger';
import { intervalI } from 'src/types';

export class addQuestionBodyDto {
  @ApiProperty({ example: 'Как оцениваете коммуникацию коллеги?' })
  question_text: string

  @ApiProperty({
    example: 1,
    description: 'ID ревью',
  })
  review_id: number
}

export class setReviewBodyDto {
  @ApiProperty({
    example: 1,
    description: 'ID ревью, для которого устанавливается новый интервал',
  })
  review_id: number

  @ApiProperty({
    type: intervalI,
    description: 'Интервал проведения ревью (список месяцев и день месяца)',
  })
  review_interval: intervalI
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
