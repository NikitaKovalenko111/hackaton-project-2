import { Employee } from 'src/EmployeeModule/employee.entity';
import type { requestStatus, requestType, RoleType } from 'src/types';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
    request_id: number

    @Column()
    request_type: requestType

    @Column({ default: 'pending' })
    request_status: requestStatus

    @Column()
    request_date: Date

    @OneToOne(() => Employee, {
        nullable: true
    })
    @JoinColumn({ name: "request_receiver" })
    request_receiver: Employee | null

    @Column({
        nullable: true
    })
    request_role_receiver: RoleType

    @OneToOne(() => Employee)
    @JoinColumn({ name: "request_owner_id" })
    request_owner: Employee

    constructor(item: Partial<Request>) {
        Object.assign(this, item)
    }
}