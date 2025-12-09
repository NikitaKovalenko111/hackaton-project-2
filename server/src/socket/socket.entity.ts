import { Employee } from 'src/EmployeeModule/employee.entity'
import { clientType } from 'src/types'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Socket {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  socket_id: number

  @ApiProperty({
    example: 'Vn6fSDW123',
    description: 'ID соединения Socket.IO',
  })
  @Column({
    unique: true,
    type: 'varchar',
    length: 256,
  })
  client_id: string

  @ApiProperty({
    enum: clientType,
    description: 'Тип клиента (WEB или TELEGRAM)',
  })
  @Column({
    type: 'enum',
    enum: clientType,
  })
  client_type: clientType

  @ApiProperty({
    type: () => Employee,
    description: 'Сотрудник, связанный с сокетом',
  })
  @ManyToOne(() => Employee, (employee) => employee.sockets)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  constructor(item: Partial<Socket>) {
    Object.assign(this, item)
  }
}
