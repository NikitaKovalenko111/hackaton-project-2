import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Review } from './review.entity'
import { Answer } from './answer.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Question {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  question_id: number

  @ApiProperty({ example: 'Как оцениваете вовлечённость коллеги?' })
  @Column({
    type: 'text',
  })
  question_text: string

  @ApiProperty({ type: () => Review })
  @ManyToOne(() => Review, (review) => review.questions)
  @JoinColumn({
    name: 'review_id',
  })
  review: Review

  @ApiProperty({ type: () => [Answer] })
  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[]

  constructor(item: Partial<Question>) {
    Object.assign(this, item)
  }
}
