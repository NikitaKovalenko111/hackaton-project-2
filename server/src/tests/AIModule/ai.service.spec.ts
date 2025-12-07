import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from 'src/AIModule/ai.service';
import { SkillService } from 'src/SkillModule/skill.service';
import GigaChat from 'gigachat';
import { skillLevel } from 'src/types';

jest.mock('gigachat');

describe('AIService', () => {
  let service: AIService;
  const mockSkillService = {
    getSkillShapeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        { provide: SkillService, useValue: mockSkillService },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return AI plan', async () => {
    const mockSkillShape = { skill_name: 'JavaScript' };
    const mockResponse = {
      choices: [{ message: { content: 'Improve by practicing daily' } }],
    };

    mockSkillService.getSkillShapeById.mockResolvedValue(mockSkillShape);
    (GigaChat as jest.Mock).mockImplementation(() => ({
      chat: jest.fn().mockResolvedValue(mockResponse),
    }));

    const result = await service.getPlan(1, skillLevel.MID);

    expect(result.skill_shape).toEqual(mockSkillShape);
    expect(result.skill_level).toBe(skillLevel.MID);
    expect(result.message).toBe('Improve by practicing daily');
    expect(mockSkillService.getSkillShapeById).toHaveBeenCalledWith(1);
  });

  it('should throw if skillService fails', async () => {
    mockSkillService.getSkillShapeById.mockRejectedValue(new Error('Not found'));

    await expect(service.getPlan(1, skillLevel.MID)).rejects.toThrow('Not found');
  });
});
