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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  role_id: number

  @ApiProperty({ example: 'ADMIN' })
  @Column()
  role_name: RoleType

  @ApiProperty({ type: () => Employee })
  @OneToOne(() => Employee, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.roles)
  @JoinColumn({ name: 'company_id' })
  company: Company

  constructor(item: Partial<Role>) {
    Object.assign(this, item)
  }
}
