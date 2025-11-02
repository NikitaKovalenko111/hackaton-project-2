import { Company } from 'src/CompanyModule/company.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { Skill } from './skill.entity'

@Entity()
export class SkillShape {
  @PrimaryGeneratedColumn()
  skill_shape_id: number

  @ManyToOne(() => Company, (company) => company.skills)
  @JoinColumn({ 
    name: 'company_id' 
  })
  company: Company

  @OneToMany(() => Skill, (skill) => skill.skill_shape, {
    cascade: true,
  })
  skills: Skill[]

  @Column({
    type: 'varchar',
    length: '96'
  })
  skill_name: string

  @Column({
    type: 'varchar',
    length: '256'
  })
  skill_desc: string

  constructor(item: Partial<SkillShape>) {
    Object.assign(this, item)
  }
}
