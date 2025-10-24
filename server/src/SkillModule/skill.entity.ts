import { Employee } from 'src/EmployeeModule/employee.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { SkillShape } from './skillShape.entity';
import type { skillLevel } from 'src/types';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    skill_connection_id: number;

    @ManyToOne(() => SkillShape, skillShape => skillShape.skills)
    @JoinColumn({ name: "skill_shape_id" })
    skill_shape: SkillShape

    @Column()
    skill_level: skillLevel

    @ManyToOne(() => Employee, employee => employee.skills)
    @JoinColumn({ name: "employee_id" })
    employee: Employee

    constructor(item: Partial<Skill>) {
        Object.assign(this, item)
    }
}