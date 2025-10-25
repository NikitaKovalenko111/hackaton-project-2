import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity';
import { skillLevel } from 'src/types';

interface updateSkillLevelBodyDto {
    skill_connection_id: number
    skill_level: skillLevel
}

@Controller('skill')
export class SkillController {
    constructor(private readonly skillService: SkillService) { }

    @Patch('/level/update')
    async updateSkillLevel(@Body() updateSkillLevelBody: updateSkillLevelBodyDto): Promise<Skill> {
        const { skill_connection_id, skill_level } = updateSkillLevelBody

        const skill = await this.skillService.updateSkillLevel(skill_connection_id, skill_level)

        return skill
    }

    @Delete('/:id/delete')
    async deleteSkill(@Param('id') skillId: number): Promise<Skill> {
        const skill = await this.skillService.deleteSkill(skillId)

        return skill
    }
}