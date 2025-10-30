import { Body, Controller, Post } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import type { generateStatisticsBodyDto } from './statistics.dto'

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('/generate')
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
