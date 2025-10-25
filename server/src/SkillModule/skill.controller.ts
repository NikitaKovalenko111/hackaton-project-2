import { Body, Controller, Delete, Get, HttpException, Param, Patch } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity';
import { skillLevel } from 'src/types';
import { SkillShape } from './skillShape.entity';

interface updateSkillLevelBodyDto {
    skill_connection_id: number
    skill_level: skillLevel
}

@Controller('skill')
export class SkillController {
    constructor(private readonly skillService: SkillService) { }

    @Patch('/level/update')
    async updateSkillLevel(@Body() updateSkillLevelBody: updateSkillLevelBodyDto): Promise<Skill> {
        try {
            const { skill_connection_id, skill_level } = updateSkillLevelBody
    
            const skill = await this.skillService.updateSkillLevel(skill_connection_id, skill_level)
    
            return skill
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Delete('/:id/delete')
    async deleteSkill(@Param('id') skillId: number): Promise<Skill> {
        try {
            const skill = await this.skillService.deleteSkill(skillId)
    
            return skill
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/skillShape/:id')
    async getSkillShapeById(@Param('id') skillShapeId: number): Promise<SkillShape> {
        try {
            const skillShape = await this.skillService.getSkillShapeById(skillShapeId)

            return skillShape
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}