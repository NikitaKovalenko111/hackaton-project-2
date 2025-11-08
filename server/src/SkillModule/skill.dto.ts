import { skillLevel } from 'src/types'
import { ApiProperty } from '@nestjs/swagger';

export class updateSkillLevelBodyDto {
  @ApiProperty({ example: 10, description: 'ID связи навыка' })
  skill_connection_id: number

  @ApiProperty({ enum: skillLevel, example: skillLevel.MIDDLE, description: 'Новый уровень навыка' })
  skill_level: skillLevel
}
