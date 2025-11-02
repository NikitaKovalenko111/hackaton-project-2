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

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  interview_id: number

  @Column({
    nullable: true,
    type: 'bigint'
  })
  interview_duration: number

  @Column({
    type: 'timestamp'
  })
  interview_date: Date

  @Column({
    type: 'text',
  })
  interview_desc: string

  @Column({ 
    default: interviewStatusType.PLANNED,
    type: 'enum',
    enum: interviewStatusType
  })
  interview_status: interviewStatusType

  @Column({
    type: 'enum',
    enum: interviewType
  })
  interview_type: interviewType

  @ManyToOne(() => Employee, (employee) => employee.plannedInterviews)
  @JoinColumn({ 
    name: 'interview_subject_id' 
  })
  interview_subject: Employee

  @ManyToOne(() => Employee, (employee) => employee.createdInterviews)
  @JoinColumn({ name: 'interview_owner_id' })
  interview_owner: Employee

  @ManyToOne(() => Company, (company) => company.interviews)
  @JoinColumn({ name: 'company_id' })
  company: Company

  @Column({ 
    type: 'text',
    default: ''
  })
  interview_comment: string

  constructor(item: Partial<Interview>) {
    Object.assign(this, item)
  }
}
