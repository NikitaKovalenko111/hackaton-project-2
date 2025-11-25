import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from 'src/EmployeeModule/employee.controller';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { HttpException } from '@nestjs/common';
import { employeeDto } from 'src/types';

// Мокаем EmployeeService
const mockEmployeeService = {
  setStatus: jest.fn(),
  uploadPhoto: jest.fn(),
  registration: jest.fn(),
  authorization: jest.fn(),
  authorizationTg: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
  getEmployee: jest.fn(),
  getEmployeeById: jest.fn(),
};

describe('EmployeeController', () => {
  let controller: EmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [{ provide: EmployeeService, useValue: mockEmployeeService }],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set employee status', async () => {
    mockEmployeeService.setStatus.mockReturnValue('ok');

    const req: any = { employee: { employee_id: 1 } };
    const result = controller.setEmployeeStatus(req, { status: 'active' });

    await expect(result).resolves.toBe('ok');
    expect(mockEmployeeService.setStatus).toHaveBeenCalledWith('active', 1);
  });

  it('should register employee', async () => {
    const mockResponse: any = { cookie: jest.fn() };
    const mockData = { refreshToken: 'token', id: 1, name: 'John' };

    mockEmployeeService.registration.mockResolvedValue(mockData);

    const body = { name: 'John', password: 'pass' };
    const result = await controller.registerEmployee(body, mockResponse);

    expect(result).toEqual(mockData);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'token',
      expect.any(Object),
    );
  });

  it('should get employee profile', async () => {
    const req: any = { employee: { employee_id: 1 } };
    const mockProfile = { employee_id: 1, employee_name: 'John' };

    mockEmployeeService.getEmployee.mockResolvedValue(mockProfile);

    const result = await controller.getProfile(req, {} as any);

    expect(result).toBeInstanceOf(employeeDto);
    expect(result.employee_id).toBe(mockProfile.employee_id);
    expect(result.employee_name).toBe(mockProfile.employee_name);
  });

  it('should throw HttpException if employee not found in profile', async () => {
    const req: any = { employee: { employee_id: null } };
    await expect(controller.getProfile(req, {} as any)).rejects.toThrow(HttpException);
  });

  it('should get employee by id', async () => {
    const mockProfile = { employee_id: 2, employee_name: 'Alice' };
    mockEmployeeService.getEmployeeById.mockResolvedValue(mockProfile);

    const result = await controller.getProfileById({} as any, 2);

    expect(result).toBeInstanceOf(employeeDto);
    expect(result.employee_id).toBe(mockProfile.employee_id);
    expect(result.employee_name).toBe(mockProfile.employee_name);
  });
});
