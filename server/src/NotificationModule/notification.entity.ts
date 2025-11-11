import { Employee } from 'src/EmployeeModule/employee.entity'
import { notificationStatusType, notificationType } from 'src/types'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number

  @Column({
    type: 'enum',
    enum: notificationType
  })
  notification_type: notificationType

  @ManyToOne(() => Employee, employee => employee.notifications)
  @JoinColumn({
    name: "receiver_id"
  })
  receiver: Employee

  @CreateDateColumn({
    type: 'timestamp'
  })
  created_at: Date

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
