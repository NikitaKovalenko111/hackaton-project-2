import { Company } from 'src/CompanyModule/company.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import type { reviewStatus } from 'src/types';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    review_id: number;

    @Column({
        type: 'bigint',
        nullable: true
    })
    review_interval: number

    @Column({
        default: 'pending'
    })
    review_status: reviewStatus

    @Column({
        default: 1
    })
    review_cycle: number

    @OneToOne(() => Company)
    @JoinColumn({
        name: "company_id"
    })
    company: Company

    @OneToMany(() => Question, question => question.review)
    questions: Question

    constructor(item: Partial<Review>) {
        Object.assign(this, item)
    }
}