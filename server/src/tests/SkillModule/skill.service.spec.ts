import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from 'src/SkillModule/skill.service';
import { Repository } from 'typeorm';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { RequestService } from 'src/socket/request.service';
import ApiError from 'src/apiError';

const mockSkillShapeRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockSkillRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

const mockCompanyRepo = {
  findOne: jest.fn(),
};

const mockRequestService = {
  removeRequestsBySkillShape: jest.fn(),
};

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        { provide: 'SkillShapeRepository', useValue: mockSkillShapeRepo },
        { provide: 'SkillRepository', useValue: mockSkillRepo },
        { provide: 'CompanyRepository', useValue: mockCompanyRepo },
        { provide: RequestService, useValue: mockRequestService },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create skill', async () => {
    const company = { company_id: 1 } as Company;
    const skillShape = { skill_name: 'JS', skill_desc: 'Desc', company } as SkillShape;
    mockCompanyRepo.findOne.mockResolvedValue(company);
    mockSkillShapeRepo.save.mockResolvedValue(skillShape);

    const result = await service.createSkill('JS', 'Desc', 1);

    expect(result).toEqual(skillShape);
    expect(mockCompanyRepo.findOne).toHaveBeenCalledWith({ where: { company_id: 1 } });
    expect(mockSkillShapeRepo.save).toHaveBeenCalled();
  });

  it('should throw error if company not found', async () => {
    mockCompanyRepo.findOne.mockResolvedValue(null);

    await expect(service.createSkill('JS', 'Desc', 1)).rejects.toBeInstanceOf(ApiError);
  });

  it('should give skill to employee', async () => {
    const employee: any = { employee_id: 1 };
    const skillShape: any = { skill_shape_id: 1 };
    const skill = { employee, skill_shape: skillShape, skill_level: 3 } as Skill;

    mockSkillShapeRepo.findOne.mockResolvedValue(skillShape);
    mockSkillRepo.save.mockResolvedValue(skill);

    const result = await service.giveSkill(employee, 1, 3);

    expect(result).toEqual(skill);
    expect(mockSkillShapeRepo.findOne).toHaveBeenCalledWith({ where: { skill_shape_id: 1 } });
    expect(mockSkillRepo.save).toHaveBeenCalledWith(expect.any(Skill));
  });

  it('should throw error if skillShape not found', async () => {
    const employee: any = { employee_id: 1 };
    mockSkillShapeRepo.findOne.mockResolvedValue(null);

    await expect(service.giveSkill(employee, 1, 3)).rejects.toBeInstanceOf(ApiError);
  });
});
