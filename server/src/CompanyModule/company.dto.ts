import { RoleType, skillLevel } from 'src/types'
import { ApiProperty } from '@nestjs/swagger'

export class createCompanyBodyDto {
  @ApiProperty({
    description: 'Название компании',
    example: 'Acme Corp',
  })
  company_name: string
}

export class createSkillBodyDto {
  @ApiProperty({
    description: 'Название навыка',
    example: 'TypeScript',
  })
  skill_name: string

  @ApiProperty({
    description: 'Описание навыка',
    example: 'Знание языка TypeScript и экосистемы',
  })
  skill_desc: string

  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  company_id: number
}

export class addCompanyEmployeeBodyDto {
  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  company_id: number

  @ApiProperty({
    description: 'ID сотрудника, которого нужно добавить',
    example: 123,
  })
  employee_to_add_id: number

  @ApiProperty({
    description: 'Роль в компании',
    enum: RoleType,
    example: RoleType.DEVELOPER,
  })
  employee_role: RoleType
}

export class giveSkillBodyDto {
  @ApiProperty({
    description: 'ID формы навыка',
    example: 5,
  })
  skill_shape_id: number

  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  company_id: number

  @ApiProperty({
    description: 'ID сотрудника, которому даётся навык',
    example: 123,
  })
  employee_to_give_id: number

  @ApiProperty({
    description: 'Уровень навыка',
    enum: skillLevel,
    example: skillLevel.MIDDLE,
  })
  skill_level: skillLevel
}

export class giveSkillToManyBodyDto {
  @ApiProperty({
    description: 'ID формы навыка',
    example: 5,
  })
  skill_shape_id: number

  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  company_id: number

  @ApiProperty({
    description: 'Список ID сотрудников',
    example: [123, 456, 789],
    isArray: true,
  })
  employees_to_give_id: number[]

  @ApiProperty({
    description: 'Уровень навыка',
    enum: skillLevel,
    example: skillLevel.JUNIOR,
  })
  skill_level: skillLevel
}

export class giveRoleBodyDto {
  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  company_id: number

  @ApiProperty({
    description: 'ID сотрудника, которому даётся роль',
    example: 123,
  })
  employee_to_give_id: number

  @ApiProperty({
    description: 'Название роли',
    enum: RoleType,
    example: RoleType.HR,
  })
  role_name: RoleType
}

export class addEmployeeByEmailBodyDto {
  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  company_id: number

  @ApiProperty({
    description: 'Email сотрудника',
    example: 'john.doe@example.com',
  })
  employee_to_add_email: string
  @ApiProperty({
    description: 'Роль в компании',
    enum: RoleType,
    example: RoleType.TEAMLEAD,
  })
  employee_role: RoleType
}

export class CompanyEmployeeDto {
  @ApiProperty({ example: 1, description: 'ID сотрудника' })
  id: number

  @ApiProperty({ example: 'Иван', description: 'Имя сотрудника' })
  name: string

  @ApiProperty({ example: 'Иванов', description: 'Фамилия сотрудника' })
  surname: string

  @ApiProperty({ example: 'ivan@example.com', description: 'Email сотрудника' })
  email: string

  @ApiProperty({ example: 'active', description: 'Статус сотрудника' })
  status: string

  @ApiProperty({
    example: 'photo.jpg',
    description: 'URL фото сотрудника',
    required: false,
  })
  photo?: string
}
