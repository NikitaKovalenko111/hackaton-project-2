import { Employee } from 'src/EmployeeModule/employee.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SkillShape } from './skillShape.entity';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    skill_connection_id: number;

    @ManyToOne(() => SkillShape, skillShape => skillShape.skills)
    @JoinColumn({ name: "skill_shape_id" })
    skill_shape_id: SkillShape

    @ManyToOne(() => Employee, employee => employee.skills)
    @JoinColumn({ name: "employee_id" })
    employee_id: Employee

    constructor(item: Partial<Skill>) {
        Object.assign(this, item)
    }
}