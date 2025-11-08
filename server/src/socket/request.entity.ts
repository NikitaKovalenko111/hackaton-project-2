import { Employee } from 'src/EmployeeModule/employee.entity'
import { Skill } from 'src/SkillModule/skill.entity'
import { requestStatus, requestType, RoleType } from 'src/types'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Request {
  @ApiProperty({ example: 1, description: 'ID запроса' })
  @PrimaryGeneratedColumn()
  request_id: number

  @ApiProperty({ enum: requestType, description: 'Тип запроса' })
  @Column({
    type: 'enum',
    enum: requestType
  })
  request_type: requestType

  @ApiProperty({ enum: requestStatus, default: 'pending', description: 'Статус запроса' })
  @Column({ 
    default: 'pending',
    type: 'enum',
    enum: requestStatus
  })
  request_status: requestStatus

  @ApiProperty({ type: () => Skill, description: 'Навык, связанный с запросом' })
  @ManyToOne(() => Skill, (skill) => skill.requests)
  @JoinColumn({ 
    name: 'request_skill_id' 
  })
  request_skill: Skill

  @ApiProperty({ example: '2025-11-06T12:00:00Z', description: 'Дата создания запроса' })
  @CreateDateColumn()
  request_date: Date

  @ApiProperty({ type: () => Employee, description: 'Получатель запроса' })
  @ManyToOne(() => Employee, (employee) => employee.receivedRequests)
  @JoinColumn({ name: 'request_receiver_id' })
  request_receiver: Employee

  @ApiProperty({ enum: RoleType, description: 'Роль получателя запроса', required: false })
  @Column({
    nullable: true,
    type: 'enum',
    enum: RoleType
  })
  request_role_receiver: RoleType

  @ApiProperty({ type: () => Employee, description: 'Отправитель запроса' })
  @ManyToOne(() => Employee, (employee) => employee.sendedRequests)
  @JoinColumn({ name: 'request_owner_id' })
  request_owner: Employee

  constructor(item: Partial<Request>) {
    Object.assign(this, item)
  }
}
