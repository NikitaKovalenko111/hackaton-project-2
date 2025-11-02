import { Company } from 'src/CompanyModule/company.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity()
export class Statistics {
  @PrimaryGeneratedColumn()
  statistics_id: number

  @Column({
    type: 'varchar',
    length: 96
  })
  statistics_name: string

  @Column({
    type: 'text'
  })
  statistics_data: string

  @ManyToOne(() => Company, (company) => company.statistics)
  @JoinColumn({ name: 'company_id' })
  company: Company

  constructor(item: Partial<Statistics>) {
    Object.assign(this, item)
  }
}
