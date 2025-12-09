import { Body, Controller, Post } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { generateStatisticsBodyDto } from './statistics.dto'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger'
import { Statistics } from './statistics.entity'

@ApiTags('Statistics')
@ApiExtraModels(Statistics)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('/generate')
  @ApiOperation({ summary: 'Генерация статистических данных по компании' })
  @ApiBody({ type: generateStatisticsBodyDto })
  @ApiResponse({
    status: 200,
    description: 'Сгенерированные статистические данные',
    type: [Statistics],
  })
  async generateStatistics(
    @Body() generateStatisticsBody: generateStatisticsBodyDto,
  ) {
    const { company_id } = generateStatisticsBody

    const statistics = await this.statisticsService.generate(company_id, [
      'skillsByCount',
      'skillsByLevel',
      'interviewsByType',
      'interviewsByStatus',
      'employeeByRoles',
    ])

    return statistics
  }
}
