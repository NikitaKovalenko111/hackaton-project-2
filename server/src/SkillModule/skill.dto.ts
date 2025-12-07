import { skillLevel } from 'src/types'
import { ApiProperty } from '@nestjs/swagger';

export class updateSkillLevelBodyDto {
  @ApiProperty({ example: 10, description: 'ID связи навыка' })
  skill_connection_id: number

  @ApiProperty({ enum: skillLevel, example: skillLevel.MIDDLE, description: 'Новый уровень навыка' })
  skill_level: skillLevel
}

export class skillOrder {
  @ApiProperty({
    example: 'Написать чистый и читаемый код',
    description: 'Текст конкретного требования или задания в оценке навыка',
  })
  order_text: string
}

export class addSkillOrderBodyDto {
  @ApiProperty({
    example: 5,
    description: 'ID формы навыка (SkillShape), к которой добавляются задания',
  })
  skill_shape_id: number

  @ApiProperty({
    enum: skillLevel,
    example: skillLevel.MIDDLE,
    description: 'Уровень навыка, для которого добавляются задания',
  })
  skill_level: skillLevel

  
  @ApiProperty({
    type: [skillOrder],
    description: 'Массив заданий (требований) для данного уровня навыка',
    example: [
      { order_text: 'Понимание основ SOLID' },
      { order_text: 'Опыт с TypeORM и NestJS' },
    ],
  })
  orders: skillOrder[]
}