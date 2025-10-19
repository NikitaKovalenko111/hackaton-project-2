import { Company } from 'src/CompanyModule/company.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity()
export class SkillShape {
    @PrimaryGeneratedColumn()
    skill_shape_id: number

    @ManyToOne(() => Company, company => company.skills)
    @JoinColumn({ name: "company_id" })
    company_id: Company;

    @Column()
    skill_name: string

    @Column()
    skill_desc: string

    constructor(item: Partial<SkillShape>) {
        Object.assign(this, item)
    }
}