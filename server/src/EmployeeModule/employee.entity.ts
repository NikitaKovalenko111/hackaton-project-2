import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column()
    employee_company_id: number;

    @Column()
    employee_name: string;

    @Column()
    employee_surname: string;

    @Column()
    employee_email: string;

    @Column()
    employee_role: string

    @Column()
    employee_status: string

    @Column()
    employee_photo: string
}