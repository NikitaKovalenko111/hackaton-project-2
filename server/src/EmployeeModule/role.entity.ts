import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { Employee } from './employee.entity'
import { Company } from 'src/CompanyModule/company.entity'
import type { RoleType } from 'src/types'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number

  @Column()
  role_name: RoleType

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  @ManyToOne(() => Company, (company) => company.roles)
  @JoinColumn({ name: 'company_id' })
  company: Company

  constructor(item: Partial<Role>) {
    Object.assign(this, item)
  }
}
