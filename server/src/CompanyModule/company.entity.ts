import { Employee } from 'src/EmployeeModule/employee.entity'
import { Role } from 'src/EmployeeModule/role.entity'
import { SkillShape } from 'src/SkillModule/skillShape.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Team } from './../TeamModule/team.entity'
import { Interview } from 'src/InterviewModule/interview.entity'
import { Statistics } from 'src/StatisticsModule/statistics.entity'
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  company_id: number

  @ApiProperty({ example: 'Acme Corp' })
  @Column({
    type: 'varchar',
    length: 128
  })
  company_name: string

  @ApiProperty({ example: 'logo.png', nullable: true })
  @Column({ 
    type: 'varchar',
    length: 128,
    nullable: true 
  })
  company_logo: string

  @ApiProperty({ type: () => [Employee] })
  @OneToMany((type) => Employee, (employee) => employee.company, {
    cascade: true,
  })
  employees: Employee[]

  @ApiProperty({ type: () => [Role] })
  @OneToMany((type) => Role, (role) => role.company, {
    cascade: true,
  })
  roles: Role[]

  @ApiProperty({ type: () => [SkillShape] })
  @OneToMany((type) => SkillShape, (skillShape) => skillShape.company, {
    cascade: true,
  })
  skills: SkillShape[]

  @ApiProperty({ type: () => [Team] })
  @OneToMany((type) => Team, (team) => team.company, {
    cascade: true,
  })
  teams: Team[]

  @ApiHideProperty()
  @OneToMany((type) => Interview, (interview) => interview.company, {
    cascade: true,
  })
  interviews: Interview[]

  @ApiProperty({ type: () => [Statistics] })
  @OneToMany((type) => Statistics, (statistics) => statistics.company, {
    cascade: true,
  })
  statistics: Statistics[]

  constructor(item: Partial<Company>) {
    Object.assign(this, item)
  }
}
