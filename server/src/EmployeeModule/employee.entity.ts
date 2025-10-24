import { Company } from 'src/CompanyModule/company.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Team } from 'src/TeamModule/team.entity';
import { Request } from 'src/socket/request.entity';
import { Interview } from 'src/InterviewModule/interview.entity';

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
    employee_status: string;

    @Column({ default: '' })
    employee_photo: string;

    @Column()
    employee_password: string;

    @Column({
        nullable: true,
        default: null,
        type: 'bigint'
    })
    telegram_id: number

    @OneToMany(() => Role, role => role.employee, {
        cascade: true
    })
    roles: Role[]

    @OneToMany(() => Skill, skill => skill.employee, {
        cascade: true
    })
    skills: Skill[]

    @ManyToOne(() => Company, company => company.employees, {
        nullable: true,
    })
    @JoinColumn({ name: "company_id" })
    company: Company;

    @ManyToOne(() => Team, team => team.employees, {
        nullable: true
    })
    @JoinColumn({ name: 'team_id' })
    team: Team

    @OneToMany(() => Request, request => request.request_owner, {
        cascade: true
    })
    sendedRequests: Request[]

    @OneToMany(() => Request, request => request.request_receiver, {
        cascade: true
    })
    receivedRequests: Request[]

    @OneToMany(() => Interview, interview => interview.interview_owner, {
        cascade: true
    })
    createdInterviews: Interview[]

    @OneToMany(() => Interview, interview => interview.interview_subject, {
        cascade: true
    })
    plannedInterviews: Interview[]

    constructor(item: Partial<Employee>) {
        Object.assign(this, item)
    }
}