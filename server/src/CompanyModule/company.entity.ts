import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    company_id: number;

    @Column()
    company_name: string;

    @Column()
    company_logo: string;

    @Column()
    company_email: string;

}