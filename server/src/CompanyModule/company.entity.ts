import { Employee } from 'src/EmployeeModule/employee.entity';
import { Role } from 'src/EmployeeModule/role.entity';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Team } from './../TeamModule/team.entity';
import { Interview } from 'src/InterviewModule/interview.entity';
import { Statistics } from 'src/StatisticsModule/statistics.entity';

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    company_id: number;

    @Column()
    company_name: string;

    @Column({ nullable: true })
    company_logo: string;

    @OneToMany(type => Employee, employee => employee.company, {
        cascade: true
    })
    employees: Employee[];

    @OneToMany(type => Role, role => role.company, {
        cascade: true
    })
    roles: Role[]

    @OneToMany(type => SkillShape, skillShape => skillShape.company, {
        cascade: true
    })
    skills: SkillShape[];

    @OneToMany(type => Team, team => team.company, {
        cascade: true
    })
    teams: Team[]

    @OneToMany(type => Interview, interview => interview.company, {
        cascade: true
    })
    interviews: Interview[]

    @OneToMany(type => Statistics, statistics => statistics.company, {
        cascade: true
    })
    statistics: Statistics[]

    constructor(item: Partial<Company>) {
        Object.assign(this, item)
    }
}