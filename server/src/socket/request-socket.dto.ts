import { requestType } from 'src/types'
import { ApiProperty } from '@nestjs/swagger';

export class requestDto {
  @ApiProperty({ enum: requestType, description: 'Тип запроса' })
  requestType: requestType

  @ApiProperty({ example: 5, description: 'ID навыка, по которому отправлен запрос' })
  skill_id: number

  @ApiProperty({ example: 12, description: 'ID сотрудника-отправителя' })
  employeeId: number
}

export class cancelRequestDto {
  @ApiProperty({ example: 7, description: 'ID запроса для отмены' })
  request_id: number

  @ApiProperty({ example: 3, description: 'ID сотрудника, отменяющего запрос' })
  employee_id: number

  @ApiProperty({
    example: "Недостаточно компетенций",
    description: "Обоснование действия",
    required: false,
})
  justification?: string
}

export class completeRequestDto {
  @ApiProperty({ example: 7, description: 'ID запроса, который нужно завершить' })
  request_id: number
}
