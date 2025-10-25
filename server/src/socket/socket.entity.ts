import { Employee } from 'src/EmployeeModule/employee.entity';
import type { clientType } from 'src/types';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Socket {
    @PrimaryGeneratedColumn()
    socket_id: number

    @Column({
        unique: true
    })
    client_id: string

    @Column()
    client_type: clientType

    @ManyToOne(() => Employee, employee => employee.sockets)
    @JoinColumn({ name: "employee_id" })
    employee: Employee

    constructor(item: Partial<Socket>) {
        Object.assign(this, item)
    }
}