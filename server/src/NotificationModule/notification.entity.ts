import { Employee } from 'src/EmployeeModule/employee.entity'
import { notificationStatusType, notificationType } from 'src/types'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Notification {@ApiProperty({ example: 12, description: "ID уведомления" })
  @PrimaryGeneratedColumn()
  notification_id: number

  @ApiProperty({ example: "NEW_REQUEST", enum: notificationType, description: "Тип уведомления" })
  @Column({
    type: 'enum',
    enum: notificationType
  })
  notification_type: notificationType

  @ApiProperty({ type: () => Employee, description: "Получатель уведомления" })
  @ManyToOne(() => Employee, employee => employee.notifications)
  @JoinColumn({
    name: "receiver_id"
  })
  receiver: Employee

  @Column({
    type: 'int'
  })
  object_id: number

  @ApiProperty({ example: "2024-12-02 14:32:00", description: "Дата создания" })
  @CreateDateColumn({
    type: 'timestamp'
  })
  created_at: Date

  @ApiProperty({ example: "NOT_APPLIED", enum: notificationStatusType, description: "Статус уведомления" })
  @Column({
    type: 'enum',
    enum: notificationStatusType,
    default: notificationStatusType.NOT_APPLIED
  })
  notification_status: notificationStatusType

  constructor(item: Partial<Notification>) {
    Object.assign(this, item)
  }
}
