import { ApiProperty } from '@nestjs/swagger';

export class addTeamBodyDto {
  @ApiProperty({ example: 1, description: 'ID компании, к которой принадлежит команда' })
  company_id: number

  @ApiProperty({ example: 'Frontend team', description: 'Название команды' })
  team_desc: string | null

  @ApiProperty({ example: 'Отвечает за UI и UX', required: false })
  team_name: string

  @ApiProperty({ example: 5, description: 'ID тимлида' })
  teamlead_id: number
}

export class addEmployeeBodyDto {
  @ApiProperty({ example: 2, description: 'ID команды' })
  team_id: number

  @ApiProperty({ example: 8, description: 'ID сотрудника для добавления в команду' })
  employee_to_add_id: number
}
