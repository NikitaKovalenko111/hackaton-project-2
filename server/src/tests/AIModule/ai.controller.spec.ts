import { Test, TestingModule } from '@nestjs/testing'
import { AIController } from 'src/AIModule/ai.controller'
import { AIService } from 'src/AIModule/ai.service'
import type { getUpgradePlanBodyDto, aiResponse } from 'src/AIModule/ai.dto'

describe('AIController', () => {
  let controller: AIController
  const mockAIService = {
    getPlan: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AIController],
      providers: [{ provide: AIService, useValue: mockAIService }],
    }).compile()

    controller = module.get<AIController>(AIController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return AI upgrade plan', async () => {
    const mockBody: getUpgradePlanBodyDto = {
      skill_shape_id: 1,
      skill_level: 3,
    }
    const mockResponse: aiResponse = { plan: 'Increase skill points' }

    mockAIService.getPlan.mockResolvedValue(mockResponse)

    const result = await controller.getUpgradePlan(mockBody)

    expect(result).toEqual(mockResponse)
    expect(mockAIService.getPlan).toHaveBeenCalledWith(1, 3)
  })

  it('should propagate service errors', async () => {
    const mockBody: getUpgradePlanBodyDto = {
      skill_shape_id: 1,
      skill_level: 3,
    }
    mockAIService.getPlan.mockRejectedValue(new Error('Service error'))

    await expect(controller.getUpgradePlan(mockBody)).rejects.toThrow(
      'Service error',
    )
  })
})
