import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    question_id: number

    @Column()
    question_text: string

    @ManyToOne(() => Review, review => review.questions)
    @JoinColumn({
        name: "review_id"
    })
    review: Review

    @OneToMany(() => Answer, answer => answer.question, {
        cascade: true
    })
    answers: Answer[]

    constructor(item: Partial<Question>) {
        Object.assign(this, item)
    }
}