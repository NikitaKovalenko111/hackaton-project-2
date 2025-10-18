import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column()
    employee_name: string;

    @Column()
    employee_surname: string;

    @Column()
    employee_email: string;

    @Column({ default: '' })
    employee_status: string

    @Column({ default: '' })
    employee_photo: string

    @Column()
    employee_password: string

    constructor(item: Partial<Employee>) {
        Object.assign(this, item)
    }
}