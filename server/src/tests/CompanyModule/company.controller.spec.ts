import { Test, TestingModule } from '@nestjs/testing'
import { CompanyController } from 'src/CompanyModule/company.controller'
import { CompanyService } from 'src/CompanyModule/company.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { SkillService } from 'src/SkillModule/skill.service'
import { HttpException } from '@nestjs/common'
import { employeeDto } from 'src/types'

// Мокаем сервисы
const mockCompanyService = {
  getCompanyInfo: jest.fn(),
  getEmployees: jest.fn(),
  getSkills: jest.fn(),
  createCompany: jest.fn(),
  addEmployee: jest.fn(),
  addEmployeeByEmail: jest.fn(),
  removeEmployee: jest.fn(),
  getAllTeams: jest.fn(),
}
const mockEmployeeService = {
  getEmployee: jest.fn(),
}
const mockSkillService = {
  deleteSkillShape: jest.fn(),
  createSkill: jest.fn(),
  giveSkill: jest.fn(),
  giveSkillToMany: jest.fn(),
}

describe('CompanyController', () => {
  let controller: CompanyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: SkillService, useValue: mockSkillService },
      ],
    }).compile()

    controller = module.get<CompanyController>(CompanyController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get company info', async () => {
    const req: any = { employee: { company: { company_id: 1 } } }
    const mockCompany = { company_id: 1, company_name: 'TestCo' }
    mockCompanyService.getCompanyInfo.mockResolvedValue(mockCompany)

    const result = await controller.getCompanyInfo(req)
    expect(result).toEqual(mockCompany)
  })

  it('should remove skill shape', async () => {
    const mockSkillShape = { id: 1, name: 'SkillShape' }
    mockSkillService.deleteSkillShape.mockResolvedValue(mockSkillShape)

    const result = await controller.removeSkillShape(1)
    expect(result).toEqual(mockSkillShape)
    expect(mockSkillService.deleteSkillShape).toHaveBeenCalledWith(1)
  })

  it('should get employees', async () => {
    const req: any = { employee: { employee_id: 1 } }
    const mockEmployeeData = { employee_id: 1, company: { company_id: 1 } }
    const mockEmployees = [{ employee_id: 2, employee_name: 'Alice' }]
    mockEmployeeService.getEmployee.mockResolvedValue(mockEmployeeData)
    mockCompanyService.getEmployees.mockResolvedValue(mockEmployees)

    const result = await controller.getEmployees(req, { name: 'Alice' })
    expect(result).toEqual(mockEmployees)
  })

  it('should create company', async () => {
    const req: any = { employee: { employee_id: 1 } }
    const mockCompany = { company_id: 1, company_name: 'NewCo' }
    mockCompanyService.createCompany.mockResolvedValue(mockCompany)

    const body = { company_name: 'NewCo' }
    const result = await controller.createCompany(body, req)
    expect(result).toEqual(mockCompany)
    expect(mockCompanyService.createCompany).toHaveBeenCalledWith('NewCo', 1)
  })

  it('should add employee', async () => {
    const req: any = { employee: { employee_id: 1 } }
    const mockAddedEmployee = { employee_id: 2, employee_name: 'Bob' }
    mockCompanyService.addEmployee.mockResolvedValue(mockAddedEmployee)

    const body = { company_id: 1, employee_to_add_id: 2, employee_role: 'dev' }
    const result = await controller.addEmployee(body, req)

    expect(result).toBeInstanceOf(employeeDto)
    expect(result.employee_id).toBe(mockAddedEmployee.employee_id)
    expect(result.employee_name).toBe(mockAddedEmployee.employee_name)
  })

  it('should remove employee', async () => {
    const mockEmployee = { employee_id: 2, employee_name: 'Bob' }
    mockCompanyService.removeEmployee.mockResolvedValue(mockEmployee)

    const result = await controller.removeEmployee(2, {} as any)
    expect(result).toEqual(mockEmployee)
  })
})
