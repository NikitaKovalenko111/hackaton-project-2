import { Company } from 'src/CompanyModule/company.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Team {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  team_id: number

  @ApiProperty({ example: 'Frontend team' })
  @Column({
    type: 'varchar',
    length: 64,
  })
  team_name: string

  @ApiProperty({ example: 'Отвечает за интерфейс', nullable: true })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 256,
  })
  team_desc: string

  @ApiProperty({ type: () => Employee })
  @OneToOne((type) => Employee)
  @JoinColumn({ name: 'teamlead_id' })
  teamlead: Employee

  @ApiProperty({ type: () => [Employee] })
  @OneToMany((type) => Employee, (employee) => employee.team, {
    cascade: true,
  })
  employees: Employee[]

  @ApiProperty({ type: () => Company })
  @ManyToOne((type) => Company, (company) => company.teams)
  @JoinColumn({ name: 'company_id' })
  company: Company

  constructor(item: Partial<Team>) {
    Object.assign(this, item)
  }
}
