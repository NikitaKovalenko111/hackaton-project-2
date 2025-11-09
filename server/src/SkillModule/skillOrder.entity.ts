import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SkillShape } from "./skillShape.entity";
import { skillLevel } from "src/types";

@Entity()
export class SkillOrder {
  @PrimaryGeneratedColumn()
  skill_order_id: number

  @ManyToOne(() => SkillShape, skillShape => skillShape.skillOrders)
  @JoinColumn({
    name: 'skill_shape_id'
  })
  skill_shape: SkillShape

  @Column({
    type: 'enum',
    enum: skillLevel
  })
  skill_level: skillLevel

  @Column({
    type: 'text'
  })
  order_text: string

  constructor(item: Partial<SkillOrder>) {
    Object.assign(this, item)
  }
}
