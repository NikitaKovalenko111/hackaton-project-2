import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from 'src/socket/request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Socket } from 'src/socket/socket.entity';
import { Request } from 'src/socket/request.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { SkillService } from 'src/SkillModule/skill.service';
import ApiError from 'src/apiError';

const mockSocketRepo = {
  save: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
};

const mockRequestRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockSkillRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockEmployeeService = {
  getEmployee: jest.fn(),
  getCleanEmployee: jest.fn(),
};

const mockSkillService = {
  getSkillById: jest.fn(),
};

describe('RequestService', () => {
  let service: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        { provide: getRepositoryToken(Socket), useValue: mockSocketRepo },
        { provide: getRepositoryToken(Request), useValue: mockRequestRepo },
        { provide: getRepositoryToken(Skill), useValue: mockSkillRepo },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: SkillService, useValue: mockSkillService },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save socket', async () => {
    const employee: any = { employee_id: 1 };
    mockEmployeeService.getEmployee.mockResolvedValue(employee);
    const socket = { client_id: 'abc', employee };
    mockSocketRepo.save.mockResolvedValue(socket);

    const result = await service.saveSocket('abc', 1);

    expect(result).toEqual(socket);
    expect(mockSocketRepo.save).toHaveBeenCalledWith(expect.any(Socket));
  });

  it('should throw error if employee not found in saveSocket', async () => {
    mockEmployeeService.getEmployee.mockResolvedValue(null);
    await expect(service.saveSocket('abc', 1)).rejects.toThrow('Пользователь не найден!');
  });

  it('should get received requests', async () => {
    const employee: any = { employee_id: 1 };
    const requests = [{ request_id: 1 }];
    mockEmployeeService.getCleanEmployee.mockResolvedValue(employee);
    mockRequestRepo.find.mockResolvedValue(requests);

    const result = await service.getReceivedRequests(1);

    expect(result).toEqual(requests);
    expect(mockRequestRepo.find).toHaveBeenCalled();
  });

  it('should get sended requests', async () => {
    const employee: any = { employee_id: 2 };
    const requests = [{ request_id: 2 }];
    mockEmployeeService.getCleanEmployee.mockResolvedValue(employee);
    mockRequestRepo.find.mockResolvedValue(requests);

    const result = await service.getSendedRequests(2);

    expect(result).toEqual(requests);
    expect(mockRequestRepo.find).toHaveBeenCalled();
  });

  it('should remove socket', async () => {
    mockSocketRepo.delete.mockResolvedValue({ affected: 1 });
    const result = await service.removeSocket('abc');
    expect(result).toBe('deleted');
  });

  it('should throw error if socket not found in removeSocket', async () => {
    mockSocketRepo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.removeSocket('abc')).rejects.toThrow('Сокет не найден или не удален!');
  });
});
