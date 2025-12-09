import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { SkillShape } from './skillShape.entity'
import { skillLevel } from 'src/types'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class SkillOrder {
  @ApiProperty({ example: 1, description: 'ID записи порядка развития навыка' })
  @PrimaryGeneratedColumn()
  skill_order_id: number

  @ApiProperty({
    type: () => SkillShape,
    description: 'Навык, к которому относится порядок развития',
  })
  @ManyToOne(() => SkillShape, (skillShape) => skillShape.skillOrders)
  @JoinColumn({
    name: 'skill_shape_id',
  })
  skill_shape: SkillShape

  @ApiProperty({
    enum: skillLevel,
    example: skillLevel.JUNIOR,
    description: 'Уровень навыка',
  })
  @Column({
    type: 'enum',
    enum: skillLevel,
  })
  skill_level: skillLevel

  @ApiProperty({
    example: 'Изучить основы синтаксиса и типизацию',
    description: 'Описание задач для достижения уровня',
  })
  @Column({
    type: 'text',
  })
  order_text: string

  constructor(item: Partial<SkillOrder>) {
    Object.assign(this, item)
  }
}
