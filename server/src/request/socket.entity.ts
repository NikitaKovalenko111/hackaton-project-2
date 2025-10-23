import { Employee } from 'src/EmployeeModule/employee.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Socket {
    @PrimaryGeneratedColumn()
    socket_id: number

    @Column()
    client_id: string

    @OneToOne(() => Employee)
    @JoinColumn({ name: "employee_id" })
    employee: Employee

    constructor(item: Partial<Socket>) {
        Object.assign(this, item)
    }
}