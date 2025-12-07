import { interviewType } from 'src/types'
import { ApiProperty } from '@nestjs/swagger';

export class addInterviewBodyDto {
  @ApiProperty({ example: 5, description: 'ID сотрудника, с которым проводится интервью' })
  interview_subject: number
  @ApiProperty({ example: '2025-11-07T12:00:00Z', description: 'Дата интервью' })
  interview_date: Date
  @ApiProperty({
    enum: interviewType,
    example: 'ONLINE',
    description: 'Тип интервью (например, ONLINE / OFFLINE)',
  })
  interview_type: interviewType
  @ApiProperty({ example: 'Обсуждение итогов испытательного срока', description: 'Описание интервью' })
  interview_desc: string
}

export class addInterviewByEmailBodyDto {
  interview_subject: string
  @ApiProperty({ example: '2025-11-07T12:00:00Z', description: 'Дата интервью' })
  interview_date: Date
  @ApiProperty({
    enum: interviewType,
    example: 'ONLINE',
    description: 'Тип интервью (например, ONLINE / OFFLINE)',
  })
  interview_type: interviewType
  @ApiProperty({ example: 'Обсуждение итогов испытательного срока', description: 'Описание интервью' })
  interview_desc: string
}

export class finishInterviewBodyDto {
  @ApiProperty({ example: 1, description: 'ID интервью' })
  interview_id: number
  @ApiProperty({ example: 'Отличное выступление, кандидат принят.', description: 'Комментарий по итогам интервью' })
  interview_comment: string
  @ApiProperty({ example: 45, description: 'Длительность интервью (в минутах)' })
  interview_duration: number
}

export class cancelInterviewBodyDto {
  @ApiProperty({ example: 1, description: 'ID интервью для отмены' })
  interview_id: number
}
