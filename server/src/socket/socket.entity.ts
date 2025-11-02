import { Employee } from 'src/EmployeeModule/employee.entity'
import { clientType } from 'src/types'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Socket {
  @PrimaryGeneratedColumn()
  socket_id: number

  @Column({
    unique: true,
    type: 'varchar',
    length: 256
  })
  client_id: string

  @Column({
    type: 'enum',
    enum: clientType
  })
  client_type: clientType

  @ManyToOne(() => Employee, (employee) => employee.sockets)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  constructor(item: Partial<Socket>) {
    Object.assign(this, item)
  }
}
