import { Company } from 'src/CompanyModule/company.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { interviewStatusType, interviewType } from 'src/types'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Interview {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  interview_id: number

  @ApiProperty({ example: 60, description: 'Длительность интервью (в минутах)' })
  @Column({
    nullable: true,
    type: 'bigint'
  })
  interview_duration: number

  @ApiProperty({ example: '2025-11-07T10:00:00Z', description: 'Дата интервью' })
  @Column({
    type: 'timestamp'
  })
  interview_date: Date

  @ApiProperty({ example: 'Обсуждение задач и результатов испытательного срока' })
  @Column({
    type: 'text',
  })
  interview_desc: string

  @ApiProperty({ enum: interviewStatusType, example: interviewStatusType.PLANNED })
  @Column({ 
    default: interviewStatusType.PLANNED,
    type: 'enum',
    enum: interviewStatusType
  })
  interview_status: interviewStatusType

  @ApiProperty({ enum: interviewType, example: interviewType.HR })
  @Column({
    type: 'enum',
    enum: interviewType
  })
  interview_type: interviewType

  @ApiProperty({ type: () => Employee })
  @ManyToOne(() => Employee, (employee) => employee.plannedInterviews)
  @JoinColumn({ 
    name: 'interview_subject_id' 
  })
  interview_subject: Employee

  @ApiProperty({ type: () => Employee })
  @ManyToOne(() => Employee, (employee) => employee.createdInterviews)
  @JoinColumn({ name: 'interview_owner_id' })
  interview_owner: Employee

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.interviews)
  @JoinColumn({ name: 'company_id' })
  company: Company

  @ApiProperty({ example: 'Кандидат успешно прошёл интервью' })
  @Column({ 
    type: 'text',
    default: ''
  })
  interview_comment: string

  constructor(item: Partial<Interview>) {
    Object.assign(this, item)
  }
}
