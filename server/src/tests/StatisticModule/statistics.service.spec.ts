import { Test, TestingModule } from '@nestjs/testing'
import { StatisticsService } from 'src/StatisticsModule/statistics.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Statistics } from 'src/StatisticsModule/statistics.entity'
import { SkillService } from 'src/SkillModule/skill.service'
import { CompanyService } from 'src/CompanyModule/company.service'
import { InterviewService } from 'src/InterviewModule/interview.service'
import { spawn } from 'child_process'

jest.mock('child_process', () => ({
  spawn: jest.fn(() => {
    return {
      stdout: {
        on: jest.fn((event, cb) => {
          if (event === 'data')
            cb(Buffer.from(JSON.stringify({ mocked: true })))
        }),
      },
      stderr: { on: jest.fn() },
    }
  }),
}))

describe('StatisticsService', () => {
  let service: StatisticsService

  const mockStatisticsRepo = { findOne: jest.fn(), save: jest.fn() }
  const mockSkillService = { getSkillsByCompany: jest.fn() }
  const mockCompanyService = { getCompanyInfo: jest.fn() }
  const mockInterviewService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Statistics),
          useValue: mockStatisticsRepo,
        },
        { provide: SkillService, useValue: mockSkillService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: InterviewService, useValue: mockInterviewService },
      ],
    }).compile()

    service = module.get<StatisticsService>(StatisticsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should generate skillsByCount statistics', async () => {
    mockSkillService.getSkillsByCompany.mockResolvedValue([
      { skill_name: 'JS' },
    ])
    mockCompanyService.getCompanyInfo.mockResolvedValue({ company_id: 1 })

    await service.generate(1, ['skillsByCount'])

    expect(mockSkillService.getSkillsByCompany).toHaveBeenCalledWith(1)
    expect(mockCompanyService.getCompanyInfo).toHaveBeenCalledWith(1)
    expect(spawn).toHaveBeenCalled() // проверяем, что spawn вызвался
  })
})
