import { Body, Controller, Post } from '@nestjs/common'
import { AIService } from './ai.service';
import type { aiResponse, getUpgradePlanBodyDto } from './ai.dto';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService
  ) {}

  @Post('/get/plan')
  async getUpgradePlan(@Body() getUpgradePlanBody: getUpgradePlanBodyDto): Promise<aiResponse> {
    const { skill_shape_id, skill_level } = getUpgradePlanBody

    const response = await this.aiService.getPlan(skill_shape_id, skill_level)

    return response
  }
}
