import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Employee_token {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  token_id: number

  @ApiProperty({ example: 5 })
  @Column()
  employee_id: number

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Refresh Token',
  })
  @Column()
  token_data: string

  constructor(item: Partial<Employee_token>) {
    Object.assign(this, item)
  }
}
