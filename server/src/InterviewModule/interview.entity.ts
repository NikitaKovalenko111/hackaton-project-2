import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Interview {
    @PrimaryGeneratedColumn()
    interview_id: number;

    @Column()
    interview_duration: number;

    @Column()
    employee_id: number;

    @Column()
    company_id: string;

    @Column()
    interview_comment: string;

    @Column()
    comment_author_id: number
}