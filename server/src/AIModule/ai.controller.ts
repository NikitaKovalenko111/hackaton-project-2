import { ApiOperation, ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AIService } from './ai.service';
import { aiResponse, aiReview, getUpgradePlanBodyDto } from './ai.dto';

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService
  ) {}

  @Post('/get/plan')
  @ApiOperation({ summary: 'Получить план прокачки навыка' })
  @ApiBody({ type: getUpgradePlanBodyDto})
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ с планом улучшения',
    type: aiResponse,
  })
  async getUpgradePlan(@Body() getUpgradePlanBody: getUpgradePlanBodyDto): Promise<aiResponse> {
    const { skill_shape_id, skill_level } = getUpgradePlanBody

    const response = await this.aiService.getPlan(skill_shape_id, skill_level)

    return response
  }

  @Get('/get/review/:id')
  async getReviewOnEmployee(@Param('id') employeeId: number): Promise<aiReview> {
    const review = await this.aiService.getReview(employeeId)

    return review
  }
}
