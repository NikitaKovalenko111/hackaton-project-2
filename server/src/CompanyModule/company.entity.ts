import { Employee } from 'src/EmployeeModule/employee.entity';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

    @OneToMany(type => SkillShape, skillShape => skillShape.company, {
        cascade: true
    })
    skills: SkillShape[];

    constructor(item: Partial<Company>) {
        Object.assign(this, item)
    }
}