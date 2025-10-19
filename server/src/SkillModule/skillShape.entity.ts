import { Company } from 'src/CompanyModule/company.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { Skill } from './skill.entity';

@Entity()
export class SkillShape {
    @PrimaryGeneratedColumn()
    skill_shape_id: number

    @ManyToOne(() => Company, company => company.skills)
    @JoinColumn({ name: "company_id" })
    company_id: Company;

    @OneToMany(() => Skill, skill => skill.skill_shape_id, {
        cascade: true
    })
    skills: Skill[]

    @Column()
    skill_name: string

    @Column()
    skill_desc: string

    addSkill(skill: Skill) {
        if (this.skills == null) {
            this.skills = Array<Skill>()
        }
        this.skills.push(skill)
    }

    constructor(item: Partial<SkillShape>) {
        Object.assign(this, item)
    }
}