import { Company } from 'src/CompanyModule/company.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

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

    @OneToMany(() => Skill, skill => skill.employee, {
        cascade: true
    })
    skills: Skill[]

    @ManyToOne(() => Company, company => company.employees, {
        nullable: true,
    })
    @JoinColumn({ name: "company_id" })
    company: Company;

    constructor(item: Partial<Employee>) {
        Object.assign(this, item)
    }
}