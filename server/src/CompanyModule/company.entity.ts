import { Employee } from 'src/EmployeeModule/employee.entity';
import { Role } from 'src/EmployeeModule/role.entity';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Team } from './../TeamModule/team.entity';

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

    constructor(item: Partial<Company>) {
        Object.assign(this, item)
    }
}