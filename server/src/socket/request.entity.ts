import { Employee } from 'src/EmployeeModule/employee.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import type { requestStatus, requestType, RoleType } from 'src/types';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
    request_id: number

    @Column()
    request_type: requestType

    @Column({ default: 'pending' })
    request_status: requestStatus

    @ManyToOne(() => Skill, skill => skill.requests)
    @JoinColumn({ name: "request_skill_id" })
    request_skill: Skill

    @CreateDateColumn()
    request_date: Date

    @ManyToOne(() => Employee, employee => employee.receivedRequests)
    @JoinColumn({ name: "request_receiver_id" })
    request_receiver: Employee

    @Column({
        nullable: true
    })
    request_role_receiver: RoleType

    @ManyToOne(() => Employee, employee => employee.sendedRequests)
    @JoinColumn({ name: "request_owner_id" })
    request_owner: Employee

    constructor(item: Partial<Request>) {
        Object.assign(this, item)
    }
}