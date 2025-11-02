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

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number

  @Column({
    type: 'varchar',
    length: 64
  })
  team_name: string

  @Column({
    nullable: true,
    type: 'varchar',
    length: 256
  })
  team_desc: string

  @OneToOne((type) => Employee)
  @JoinColumn({ name: 'teamlead_id' })
  teamlead: Employee

  @OneToMany((type) => Employee, (employee) => employee.team, {
    cascade: true,
  })
  employees: Employee[]

  @ManyToOne((type) => Company, (company) => company.teams)
  @JoinColumn({ name: 'company_id' })
  company: Company

  constructor(item: Partial<Team>) {
    Object.assign(this, item)
  }
}
