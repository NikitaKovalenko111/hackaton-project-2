import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';

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

    addEmployee(employee: Employee) {
        if (this.employees == null) {
            this.employees = Array<Employee>()
        }
        this.employees.push(employee)
    }

    constructor(item: Partial<Company>) {
        Object.assign(this, item)
    }
}