import { Employee } from 'src/EmployeeModule/employee.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { SkillShape } from './skillShape.entity'
import { skillLevel } from 'src/types'
import { Request } from 'src/socket/request.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Skill {
  @ApiProperty({ example: 1, description: 'ID навыка' })
  @PrimaryGeneratedColumn()
  skill_connection_id: number

  @ApiProperty({ type: () => SkillShape, description: 'Шаблон навыка' })
  @ManyToOne(() => SkillShape, (skillShape) => skillShape.skills)
  @JoinColumn({ 
    name: 'skill_shape_id' 
  })
  skill_shape: SkillShape

  @ApiProperty({ enum: skillLevel, example: skillLevel.MIDDLE, description: 'Текущий уровень навыка' })
  @Column({
    type: 'enum',
    enum: skillLevel
  })
  skill_level: skillLevel

  @OneToMany(() => Request, (request) => request.request_skill)
  requests: Request[]
  
 @ApiProperty({ type: () => Employee, description: 'Сотрудник, которому принадлежит навык' })
  @ManyToOne(() => Employee, (employee) => employee.skills)
  @JoinColumn({ 
    name: 'employee_id' 
  })
  employee: Employee

  constructor(item: Partial<Skill>) {
    Object.assign(this, item)
  }
}
