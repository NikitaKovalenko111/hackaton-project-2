import { Test, TestingModule } from '@nestjs/testing';
import { SkillController } from 'src/SkillModule/skill.controller';
import { SkillService } from 'src/SkillModule/skill.service';
import { HttpException } from '@nestjs/common';
import { Skill } from 'src/SkillModule/skill.entity';
import { SkillShape } from 'src/SkillModule/skillShape.entity';

const mockSkillService = {
  updateSkillLevel: jest.fn(),
  deleteSkill: jest.fn(),
  getSkillShapeById: jest.fn(),
};

describe('SkillController', () => {
  let controller: SkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillController],
      providers: [{ provide: SkillService, useValue: mockSkillService }],
    }).compile();

    controller = module.get<SkillController>(SkillController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update skill level', async () => {
    const mockSkill = { skill_connection_id: 1, skill_level: 3 } as Skill;
    mockSkillService.updateSkillLevel.mockResolvedValue(mockSkill);

    const body = { skill_connection_id: 1, skill_level: 3 };
    const result = await controller.updateSkillLevel(body);

    expect(result).toEqual(mockSkill);
    expect(mockSkillService.updateSkillLevel).toHaveBeenCalledWith(1, 3);
  });

  it('should delete skill', async () => {
    const mockSkill = { skill_connection_id: 1, skill_level: 3 } as Skill;
    mockSkillService.deleteSkill.mockResolvedValue(mockSkill);

    const result = await controller.deleteSkill(1);
    expect(result).toEqual(mockSkill);
    expect(mockSkillService.deleteSkill).toHaveBeenCalledWith(1);
  });

  it('should get skill shape by id', async () => {
    const mockSkillShape = { skill_shape_id: 1, skill_name: 'JavaScript' } as SkillShape;
    mockSkillService.getSkillShapeById.mockResolvedValue(mockSkillShape);

    const result = await controller.getSkillShapeById(1);
    expect(result).toEqual(mockSkillShape);
    expect(mockSkillService.getSkillShapeById).toHaveBeenCalledWith(1);
  });
});
