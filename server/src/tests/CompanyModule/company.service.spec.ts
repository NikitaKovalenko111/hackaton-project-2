import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from 'src/CompanyModule/company.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Repository } from 'typeorm';
import { Company } from 'src/CompanyModule/company.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Role } from 'src/EmployeeModule/role.entity';
import { Review } from 'src/ReviewModule/review.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import ApiError from 'src/apiError';
import { RoleType } from 'src/types';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepo: Repository<Company>;
  let employeeRepo: Repository<Employee>;
  let roleRepo: Repository<Role>;
  let reviewRepo: Repository<Review>;
  let employeeService: EmployeeService;

  const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  });

  const mockEmployeeService = {
    getEmployee: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: getRepositoryToken(Company), useFactory: mockRepository },
        { provide: getRepositoryToken(Employee), useFactory: mockRepository },
        { provide: getRepositoryToken(Role), useFactory: mockRepository },
        { provide: getRepositoryToken(Review), useFactory: mockRepository },
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepo = module.get(getRepositoryToken(Company));
    employeeRepo = module.get(getRepositoryToken(Employee));
    roleRepo = module.get(getRepositoryToken(Role));
    reviewRepo = module.get(getRepositoryToken(Review));
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add employee', async () => {
    const mockEmployee = { employee_id: 1 };
    const mockCompany = { company_id: 1 };
    (employeeRepo.findOne as jest.Mock).mockResolvedValue(mockEmployee);
    (companyRepo.findOne as jest.Mock).mockResolvedValue(mockCompany);
    (employeeRepo.save as jest.Mock).mockResolvedValue(mockEmployee);
    (roleRepo.save as jest.Mock).mockResolvedValue({});

    const result = await service.addEmployee(1, 1, RoleType.DEV);
    expect(result).toEqual(mockEmployee);
    expect(employeeRepo.findOne).toHaveBeenCalledWith({ where: { employee_id: 1 } });
    expect(companyRepo.findOne).toHaveBeenCalledWith({ where: { company_id: 1 } });
  });

  it('should throw error if employee not found', async () => {
    (employeeRepo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.addEmployee(1, 1, RoleType.DEV)).rejects.toThrow(ApiError);
  });

  it('should throw error if company not found', async () => {
    const mockEmployee = { employee_id: 1 };
    (employeeRepo.findOne as jest.Mock).mockResolvedValue(mockEmployee);
    (companyRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.addEmployee(1, 1, RoleType.DEV)).rejects.toThrow(ApiError);
  });

  it('should get company info', async () => {
    const mockCompany = { company_id: 1 };
    (companyRepo.findOne as jest.Mock).mockResolvedValue(mockCompany);

    const result = await service.getCompanyInfo(1);
    expect(result).toEqual(mockCompany);
  });

  it('should get employees', async () => {
    const mockCompany = { company_id: 1 };
    const mockEmployees = [{ employee_id: 1 }];
    (companyRepo.findOne as jest.Mock).mockResolvedValue(mockCompany);
    (employeeRepo.find as jest.Mock).mockResolvedValue(mockEmployees);

    const result = await service.getEmployees(1, 'John');
    expect(result).toEqual(mockEmployees);
  });

  it('should remove employee', async () => {
    const mockEmployee = {
      employee_id: 1,
      sendedRequests: [{ request_status: 'DONE' }],
      plannedInterviews: [{ interview_status: 'COMPLETED' }],
    };
    (employeeService.getEmployee as jest.Mock).mockResolvedValue(mockEmployee);
    (employeeRepo.save as jest.Mock).mockResolvedValue(mockEmployee);
    (roleRepo.delete as jest.Mock).mockResolvedValue({});

    const result = await service.removeEmployee(1);
    expect(result).toEqual(mockEmployee);
    expect(employeeRepo.save).toHaveBeenCalledWith(mockEmployee);
    expect(roleRepo.delete).toHaveBeenCalled();
  });

  it('should create company', async () => {
    const mockEmployee = { employee_id: 1 };
    const mockCompany = { company_id: 1 };
    (employeeService.getEmployee as jest.Mock).mockResolvedValue(mockEmployee);
    (companyRepo.save as jest.Mock).mockResolvedValue(mockCompany);
    (employeeRepo.save as jest.Mock).mockResolvedValue(mockEmployee);
    (roleRepo.save as jest.Mock).mockResolvedValue({});
    (reviewRepo.save as jest.Mock).mockResolvedValue({});

    const result = await service.createCompany('TestCo', 1);
    expect(result).toEqual(mockCompany);
  });
});
