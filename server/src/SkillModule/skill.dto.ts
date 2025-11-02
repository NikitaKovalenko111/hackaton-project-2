import { skillLevel } from 'src/types'

export interface updateSkillLevelBodyDto {
  skill_connection_id: number
  skill_level: skillLevel
}
