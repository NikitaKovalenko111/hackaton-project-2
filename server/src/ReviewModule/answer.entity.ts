import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Question } from './question.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Answer {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  answer_id: number

  @ApiProperty({ example: 'Очень внимателен к деталям' })
  @Column({
    type: 'text'
  })
  answer_text: string

  @ApiProperty({ type: () => Question })
  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({
    name: 'question_id',
  })
  question: Question

  @ApiProperty({ type: () => Employee })
  @ManyToOne(() => Employee, (employee) => employee.answers)
  @JoinColumn({
    name: 'employee_id',
  })
  employee: Employee

  @ApiProperty({ type: () => Employee })
  @ManyToOne(() => Employee, (employee) => employee.answersOn)
  @JoinColumn({
    name: 'employee_answer_to_id',
  })
  employee_answer_to: Employee

  constructor(item: Partial<Answer>) {
    Object.assign(this, item)
  }
}
