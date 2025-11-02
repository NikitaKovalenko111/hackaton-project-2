import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Employee_token {
  @PrimaryGeneratedColumn()
  token_id: number

  @Column()
  employee_id: number

  @Column()
  token_data: string

  constructor(item: Partial<Employee_token>) {
    Object.assign(this, item)
  }
}
