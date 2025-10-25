import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    answer_id: number

    @Column()
    answer_text: string

    @ManyToOne(() => Question, question => question.answers)
    @JoinColumn({
        name: "question_id"
    })
    question: Question

    @ManyToOne(() => Employee, employee => employee.answers)
    @JoinColumn({
        name: "employee_id"
    })
    employee: Employee

    @ManyToOne(() => Employee, employee => employee.answersOn)
    @JoinColumn({
        name: 'employee_answer_to_id'
    })
    employee_answer_to: Employee

    constructor(item: Partial<Answer>) {
        Object.assign(this, item)
    }
}