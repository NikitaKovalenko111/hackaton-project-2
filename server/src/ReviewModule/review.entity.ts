import { Company } from 'src/CompanyModule/company.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Question } from './question.entity'
import { reviewStatus } from 'src/types'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  review_id: number

  @ApiProperty({ example: 14 })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  review_interval: string

  @ApiProperty({ enum: reviewStatus, example: reviewStatus.PENDING })
  @Column({
    default: reviewStatus.PENDING,
    type: 'enum',
    enum: reviewStatus
  })
  review_status: reviewStatus

  @ApiProperty({ example: 1 })
  @Column({
    default: 1,
    type: 'int'
  })
  review_cycle: number

  @ApiProperty({ type: () => Company })
  @OneToOne(() => Company)
  @JoinColumn({
    name: 'company_id',
  })
  company: Company

  @ApiProperty({ type: () => [Question] })
  @OneToMany(() => Question, (question) => question.review)
  questions: Question

  constructor(item: Partial<Review>) {
    Object.assign(this, item)
  }
}
