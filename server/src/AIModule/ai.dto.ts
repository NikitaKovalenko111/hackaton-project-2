import { SkillShape } from "src/SkillModule/skillShape.entity"
import { skillLevel } from "src/types"

export interface getUpgradePlanBodyDto {
    skill_shape_id: number
    skill_level: skillLevel
}

export interface aiResponse {
  message: string
  skill_shape: SkillShape,
  skill_level: skillLevel
}