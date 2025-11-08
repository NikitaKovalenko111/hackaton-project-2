import { Company } from 'src/CompanyModule/company.entity'
import { Skill } from 'src/SkillModule/skill.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { Role } from './role.entity'
import { Team } from 'src/TeamModule/team.entity'
import { Request } from 'src/socket/request.entity'
import { Interview } from 'src/InterviewModule/interview.entity'
import { Answer } from 'src/ReviewModule/answer.entity'
import { Socket } from 'src/socket/socket.entity'
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Employee {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  employee_id: number

  @ApiProperty({ example: 'Иван' })
  @Column({
    type: 'varchar',
    length: 64
  })
  employee_name: string

  @ApiProperty({ example: 'Иванов' })
  @Column({
    type: 'varchar',
    length: 64
  })
  employee_surname: string

  @ApiProperty({ example: 'ivan@example.com' })
  @Column({
    type: 'varchar',
    length: 128
  })
  employee_email: string

  @ApiProperty({ example: 'В отпуске' })
  @Column({ 
    type: 'varchar',
    length: 256,
    default: '' 
  })
  employee_status: string

  @ApiProperty({ example: 'photo.jpg' })
  @Column({
    type: 'varchar',
    length: 128,
    default: '' 
  })
  employee_photo: string

  @ApiHideProperty()
  @Column({
    type: 'varchar',
    length: 64,
    select: false 
  })
  employee_password: string

  @ApiProperty({ example: 987654321, nullable: true })
  @Column({
    nullable: true,
    default: null,
    type: 'bigint',
  })
  telegram_id: number | null

  @ApiProperty({ type: () => Role, nullable: true })
  @OneToOne(() => Role, (role) => role.employee, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true
  })
  role: Role | null

  @ApiHideProperty()
  @OneToMany(() => Skill, (skill) => skill.employee, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  skills: Skill[]

  @ApiHideProperty()
  @ManyToOne(() => Company, (company) => company.employees, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ 
    name: 'company_id' 
  })
  company: Company | null

  @ApiHideProperty()
  @ManyToOne(() => Team, (team) => team.employees, {
    nullable: true,
  })
  @JoinColumn({ 
    name: 'team_id' 
  })
  team: Team | null

  @ApiHideProperty()
  @OneToMany(() => Request, (request) => request.request_owner, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  sendedRequests: Request[]

  @ApiHideProperty()
  @OneToMany(() => Request, (request) => request.request_receiver, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  receivedRequests: Request[]

  @ApiHideProperty()
  @OneToMany(() => Interview, (interview) => interview.interview_owner, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  createdInterviews: Interview[]

  @ApiHideProperty()
  @OneToMany(() => Interview, (interview) => interview.interview_subject, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  plannedInterviews: Interview[]

  @ApiHideProperty()
  @OneToMany(() => Answer, (answer) => answer.employee, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  answers: Answer[]

  @ApiHideProperty()
  @OneToMany(() => Answer, (answer) => answer.employee_answer_to, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  answersOn: Answer[]

  @OneToMany(() => Socket, (socket) => socket.employee, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  sockets: Socket[]

  constructor(item: Partial<Employee>) {
    Object.assign(this, item)
  }
}
