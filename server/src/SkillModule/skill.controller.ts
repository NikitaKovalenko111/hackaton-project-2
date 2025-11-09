import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { SkillService } from './skill.service'
import { Skill } from './skill.entity'
import { SkillShape } from './skillShape.entity'
import { addSkillOrderBodyDto, updateSkillLevelBodyDto } from './skill.dto'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiExtraModels } from '@nestjs/swagger';
import { SkillOrder } from './skillOrder.entity'
import { skillLevel } from 'src/types'

@ApiTags('Skill')
@ApiExtraModels(Skill, SkillShape)
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Patch('/level/update')
  @ApiOperation({ summary: 'Обновить уровень навыка сотрудника' })
  @ApiBody({ type: updateSkillLevelBodyDto })
  @ApiResponse({ status: 200, description: 'Навык обновлён', type: Skill })
  async updateSkillLevel(
    @Body() updateSkillLevelBody: updateSkillLevelBodyDto,
  ): Promise<Skill> {
    try {
      const { skill_connection_id, skill_level } = updateSkillLevelBody

      const skill = await this.skillService.updateSkillLevel(
        skill_connection_id,
        skill_level,
      )

      return skill
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Delete('/:id/delete')
  @ApiOperation({ summary: 'Удалить навык сотрудника' })
  @ApiParam({ name: 'id', example: 1, description: 'ID связи навыка' })
  @ApiResponse({ status: 200, description: 'Навык успешно удалён', type: Skill })
  async deleteSkill(@Param('id') skillId: number): Promise<Skill> {
    try {
      const skill = await this.skillService.deleteSkill(skillId)

      return skill
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/skillShape/:id')
  @ApiOperation({ summary: 'Получить форму навыка по ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID формы навыка' })
  @ApiResponse({ status: 200, description: 'Информация о форме навыка', type: SkillShape })
  async getSkillShapeById(
    @Param('id') skillShapeId: number,
  ): Promise<SkillShape> {
    try {
      const skillShape = await this.skillService.getSkillShapeById(skillShapeId)

      return skillShape
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/skillOrder/add')
  async addSkillOrders(@Body() addSkillOrderBody: addSkillOrderBodyDto): Promise<SkillOrder[]> {
    try {
      const { skill_shape_id, skill_level, orders } = addSkillOrderBody

      const skillOrders = await this.skillService.addSkillOrders(skill_shape_id, skill_level, orders)

      return skillOrders
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/skillOrder/get/:skillShapeId')
  async getSkillOrderByShape(@Param('skillShapeId') skillShapeId: number, @Query('skillLevel') skillLevel?: skillLevel): Promise<SkillOrder[]> {
    try {
      const skillOrders = await this.skillService.getSkillOrdersByShape(skillShapeId, skillLevel)

      return skillOrders
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
