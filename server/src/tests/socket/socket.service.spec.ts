import { Test, TestingModule } from '@nestjs/testing';
import { SocketService } from 'src/socket/socket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Socket } from 'src/socket/socket.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { clientType } from 'src/types';
import ApiError from 'src/apiError';

const mockSocketRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockEmployeeService = {
  getCleanEmployee: jest.fn(),
};

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocketService,
        { provide: getRepositoryToken(Socket), useValue: mockSocketRepo },
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compile();

    service = module.get<SocketService>(SocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save new socket if not exists', async () => {
    const employee: any = { employee_id: 1 };
    const socket = { client_id: 'abc', employee, client_type: clientType.WEB };

    mockEmployeeService.getCleanEmployee.mockResolvedValue(employee);
    mockSocketRepo.findOne.mockResolvedValue(null);
    mockSocketRepo.save.mockResolvedValue(socket);

    const result = await service.saveSocket('abc', 1, clientType.WEB);

    expect(result).toEqual(socket);
    expect(mockSocketRepo.save).toHaveBeenCalledWith(expect.any(Socket));
  });

  it('should update socket if exists', async () => {
    const employee: any = { employee_id: 1 };
    const existingSocket = { client_id: 'old', employee, client_type: clientType.WEB };
    const updatedSocket = { client_id: 'new', employee, client_type: clientType.WEB };

    mockEmployeeService.getCleanEmployee.mockResolvedValue(employee);
    mockSocketRepo.findOne.mockResolvedValue(existingSocket);
    mockSocketRepo.save.mockResolvedValue(updatedSocket);

    const result = await service.saveSocket('new', 1, clientType.WEB);

    expect(result).toEqual(updatedSocket);
    expect(mockSocketRepo.save).toHaveBeenCalledWith(existingSocket);
  });

  it('should throw error if employee not found', async () => {
    mockEmployeeService.getCleanEmployee.mockResolvedValue(null);

    await expect(service.saveSocket('abc', 1, clientType.WEB)).rejects.toBeInstanceOf(ApiError);
  });

  it('should remove socket', async () => {
    mockSocketRepo.delete.mockResolvedValue({ affected: 1 });

    const result = await service.removeSocket('abc');

    expect(result).toBe('deleted');
    expect(mockSocketRepo.delete).toHaveBeenCalledWith({ client_id: 'abc' });
  });

  it('should get socket by employee', async () => {
    const employee: any = { employee_id: 1 };
    const socket = { client_id: 'abc', employee, client_type: clientType.WEB };

    mockSocketRepo.findOne.mockResolvedValue(socket);

    const result = await service.getSocketByEmployeeId(employee);

    expect(result).toEqual(socket);
    expect(mockSocketRepo.findOne).toHaveBeenCalledWith({
      where: { employee, client_type: clientType.WEB },
    });
  });

  it('should return null if socket not found', async () => {
    const employee: any = { employee_id: 1 };

    mockSocketRepo.findOne.mockResolvedValue(null);

    const result = await service.getSocketByEmployeeId(employee);

    expect(result).toBeNull();
  });
});
