import { ApiProperty } from '@nestjs/swagger';
import { Skill } from 'src/SkillModule/skill.entity'
import { Role } from './role.entity'
import { Company } from 'src/CompanyModule/company.entity'
import { Team } from 'src/TeamModule/team.entity'

export class registerEmployeeBodyDto {
  @ApiProperty({ example: 'Иван' })
  employee_name: string

  @ApiProperty({ example: 'Иванов' })
  employee_surname: string

  @ApiProperty({ example: 'ivan@example.com' })
  employee_email: string

  @ApiProperty({ example: 'securePassword123' })
  employee_password: string
}


  

export class changeProfileDataBodyDto {
  @ApiProperty({ example: 'Иван', required: false })
  employee_name?: string

  @ApiProperty({ example: 'Иванов', required: false })
  employee_surname?: string

  @ApiProperty({ example: 'ivan@example.com', required: false })
  employee_email?: string
}

export class changePasswordBodyDto {
  @ApiProperty({ example: 'NewStrongPassword123' })
  new_password: string

  @ApiProperty({ example: 'OldPassword456' })
  old_password: string
}

export class employeePayloadDto {
  @ApiProperty({ example: 123 })
  employee_id: number

  @ApiProperty({ example: 'Иван' })
  employee_name: string

  @ApiProperty({ example: 'Иванов' })
  employee_surname: string

  @ApiProperty({ example: 'ivan@example.com' })
  employee_email: string

  @ApiProperty({ example: 'active' })
  employee_status: string

  @ApiProperty({ example: 'photo.jpg' })
  employee_photo: string

  @ApiProperty({ type: [Skill], required: false })
  employeeSkills?: Skill[]

  @ApiProperty({ type: Role, required: false })
  employeeRole?: Role | null

  @ApiProperty({ type: Company, required: false })
  company?: Company | null

  @ApiProperty({ type: Team, required: false })
  team?: Team | null
}

export class authEmployeeBodyDto {
  @ApiProperty({ example: 'ivan@example.com' })
  employee_email: string

  @ApiProperty({ example: 'StrongPassword123' })
  employee_password: string
}

export class authEmployeeTgBodyDto {
  @ApiProperty({ example: 'ivan@example.com' })
  employee_email: string

  @ApiProperty({ example: 'StrongPassword123' })
  employee_password: string

  @ApiProperty({ example: 987654321 })
  tg_id: number
}

export class registerEmployeeReturnDto {
  @ApiProperty({ example: 'access.jwt.token' })
  accessToken: string

  @ApiProperty({ example: 'refresh.jwt.token' })
  refreshToken: string

  @ApiProperty({ type: employeePayloadDto })
  payload: employeePayloadDto
}


export class EmployeeRegistrationDto {
  @ApiProperty({ example: 'Иван', description: 'Имя сотрудника' })
  employee_name: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия сотрудника' })
  employee_surname: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email сотрудника' })
  employee_email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'Пароль сотрудника' })
  employee_password: string;
}

export class EmployeeAuthResponseDto {
  @ApiProperty({ example: 'access.jwt.token', description: 'JWT токен доступа' })
  accessToken: string;

  @ApiProperty({ example: 'refresh.jwt.token', description: 'JWT токен обновления' })
  refreshToken: string;

  @ApiProperty({
    example: {
      employee_id: 123,
      employee_name: 'Иван',
      employee_surname: 'Иванов',
      employee_email: 'ivan@example.com',
      employee_status: 'active',
      employee_photo: 'photo.jpg',
    },
    description: 'Информация о зарегистрированном сотруднике',
  })
  payload: Record<string, any>;
}

export class EmployeeLoginDto {
  @ApiProperty({ example: 'ivan@example.com', description: 'Email сотрудника' })
  employee_email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'Пароль сотрудника' })
  employee_password: string;
}

export class EmployeeLoginResponseDto {
  @ApiProperty({ example: 'access.jwt.token', description: 'JWT токен доступа' })
  accessToken: string;

  @ApiProperty({ example: 'refresh.jwt.token', description: 'JWT токен обновления' })
  refreshToken: string;

  @ApiProperty({
    description: 'Информация о сотруднике',
    example: {
      employee_id: 123,
      employee_name: 'Иван',
      employee_surname: 'Иванов',
      employee_email: 'ivan@example.com',
      employee_status: 'active',
      employee_photo: 'photo.jpg',
    },
  })
  payload: Record<string, any>;
}