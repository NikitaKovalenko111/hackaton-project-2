import { ApiProperty } from '@nestjs/swagger'

export class payloadDto {
  @ApiProperty({ example: 1 })
  employee_id: number
  @ApiProperty({ example: 'Иван' })
  employee_name: string
  @ApiProperty({ example: 'Иванов' })
  employee_surname: string
  @ApiProperty({ example: 'ivan@example.com' })
  employee_status: string | null
  @ApiProperty({ example: 'active' })
  employee_photo: string | null
  @ApiProperty({ example: 'photo.jpg' })
  employee_email: string
}
