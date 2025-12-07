import { Test, TestingModule } from '@nestjs/testing'
import { StatisticsController } from 'src/StatisticsModule/statistics.controller'
import { StatisticsService } from 'src/StatisticsModule/statistics.service'

describe('StatisticsController', () => {
  let controller: StatisticsController
  let statisticsService: StatisticsService

  const mockStatisticsService = {
    generate: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        { provide: StatisticsService, useValue: mockStatisticsService },
      ],
    }).compile()

    controller = module.get<StatisticsController>(StatisticsController)
    statisticsService = module.get<StatisticsService>(StatisticsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call statisticsService.generate with correct args', async () => {
    const companyId = 1
    const mockResult = { skillsByCount: {}, skillsByLevel: {} }
    mockStatisticsService.generate.mockResolvedValue(mockResult)

    const result = await controller.generateStatistics({
      company_id: companyId,
    })

    expect(mockStatisticsService.generate).toHaveBeenCalledWith(companyId, [
      'skillsByCount',
      'skillsByLevel',
      'interviewsByType',
      'interviewsByStatus',
      'employeeByRoles',
    ])

    expect(result).toEqual(mockResult)
  })
})
