import { ApiProperty } from '@nestjs/swagger'

export class generateStatisticsBodyDto {
  @ApiProperty({
    example: 1,
    description: 'ID компании, для которой генерируется статистика',
  })
  company_id: number
}
