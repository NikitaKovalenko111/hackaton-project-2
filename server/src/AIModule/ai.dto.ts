import { ApiProperty } from '@nestjs/swagger';
import { SkillShape } from "src/SkillModule/skillShape.entity"
import { skillLevel } from "src/types"

export class getUpgradePlanBodyDto {
  @ApiProperty({ example: 1, description: 'ID формы навыка' })
  skill_shape_id: number;

  @ApiProperty({
    example: skillLevel.JUNIOR,
    enum: skillLevel,
    description: 'Текущий уровень навыка',
  })
  skill_level: skillLevel;
}

export class aiResponse {
  @ApiProperty({ example: 'План успешно сгенерирован' })
  message: string;

  @ApiProperty({ type: SkillShape })
  skill_shape: SkillShape;

  @ApiProperty({
    example: skillLevel.MIDDLE,
    enum: skillLevel,
  })
  skill_level: skillLevel;
}