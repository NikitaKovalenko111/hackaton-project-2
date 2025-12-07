import { Company } from 'src/CompanyModule/company.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Statistics {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  statistics_id: number

  @ApiProperty({ example: 'skillsByCount' })
  @Column({
    type: 'varchar',
    length: 96,
  })
  statistics_name: string

  @ApiProperty({
    example: '<div>HTML-график с результатами статистики</div>',
    description: 'HTML-код графика (сгенерированный Python)',
  })
  @Column({
    type: 'text',
  })
  statistics_data: string

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.statistics)
  @JoinColumn({ name: 'company_id' })
  company: Company

  constructor(item: Partial<Statistics>) {
    Object.assign(this, item)
  }
}
