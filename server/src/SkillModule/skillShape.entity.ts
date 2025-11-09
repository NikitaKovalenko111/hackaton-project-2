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
import { ApiProperty } from '@nestjs/swagger';
import { SkillOrder } from './skillOrder.entity';

@Entity()
export class SkillShape {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  skill_shape_id: number

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.skills)
  @JoinColumn({ 
    name: 'company_id' 
  })
  company: Company

  @ApiProperty({ type: () => [Skill] })
  @OneToMany(() => Skill, (skill) => skill.skill_shape, {
    cascade: true,
  })
  skills: Skill[]

  @OneToMany(() => SkillOrder, skillOrder => skillOrder.skill_shape, {
    cascade: true
  })
  skillOrders: SkillOrder[]

  @ApiProperty({ example: 'TypeScript' })
  @Column({
    type: 'varchar',
    length: '96'
  })
  skill_name: string

  @ApiProperty({ example: 'Язык программирования для веб-разработки' })
  @Column({
    type: 'varchar',
    length: '256'
  })
  skill_desc: string

  constructor(item: Partial<SkillShape>) {
    Object.assign(this, item)
  }
}
