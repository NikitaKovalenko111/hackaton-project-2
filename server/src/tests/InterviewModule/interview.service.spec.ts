import { Test, TestingModule } from '@nestjs/testing'
import { InterviewService } from 'src/InterviewModule/interview.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { CompanyService } from 'src/CompanyModule/company.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Interview } from 'src/InterviewModule/interview.entity'
import { Role } from 'src/EmployeeModule/role.entity'
import ApiError from 'src/apiError'
import { RoleType, interviewStatusType } from 'src/types'

describe('InterviewService', () => {
  let service: InterviewService

  const mockRepo = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  })

  const mockEmployeeService = {
    getEmployee: jest.fn(),
    getCleanEmployee: jest.fn(),
  }

  const mockCompanyService = {
    getCompanyInfo: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewService,
        { provide: getRepositoryToken(Interview), useFactory: mockRepo },
        { provide: getRepositoryToken(Role), useFactory: mockRepo },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: CompanyService, useValue: mockCompanyService },
      ],
    }).compile()

    service = module.get<InterviewService>(InterviewService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should add interview', async () => {
    const mockEmployee = { employee_id: 1, company: { company_id: 1 } }
    const mockSubject = { employee_id: 2 }
    const mockInterview = { interview_id: 1 }

    mockEmployeeService.getEmployee.mockResolvedValue(mockEmployee)
    ;(service['interviewRepository'].save as jest.Mock).mockResolvedValue(
      mockInterview,
    )

    const result = await service.addInterview(
      mockSubject,
      new Date(),
      'online',
      'desc',
      1,
    )
    expect(result).toEqual(mockInterview)
  })

  it('should throw error if employee has no company', async () => {
    const mockEmployee = { employee_id: 1, company: null }
    mockEmployeeService.getEmployee.mockResolvedValue(mockEmployee)

    await expect(
      service.addInterview({} as any, new Date(), 'online', 'desc', 1),
    ).rejects.toThrow(ApiError)
  })

  it('should finish interview', async () => {
    const mockInterview = { interview_id: 1 }
    ;(service['interviewRepository'].findOne as jest.Mock).mockResolvedValue(
      mockInterview,
    )
    ;(service['interviewRepository'].save as jest.Mock).mockResolvedValue({
      ...mockInterview,
      interview_status: interviewStatusType.COMPLETED,
    })

    const result = await service.finishInterview(1, 30, 'Good')
    expect(result.interview_status).toBe(interviewStatusType.COMPLETED)
    expect(service['interviewRepository'].save).toHaveBeenCalledWith({
      ...mockInterview,
      interview_status: interviewStatusType.COMPLETED,
      interview_duration: 30,
      interview_comment: 'Good',
    })
  })

  it('should throw error if finishInterview not found', async () => {
    ;(service['interviewRepository'].findOne as jest.Mock).mockResolvedValue(
      null,
    )
    await expect(service.finishInterview(1, 30, 'Good')).rejects.toThrow(
      ApiError,
    )
  })

  it('should cancel interview', async () => {
    const mockInterview = { interview_id: 1 }
    ;(service['interviewRepository'].findOne as jest.Mock).mockResolvedValue(
      mockInterview,
    )
    ;(service['interviewRepository'].save as jest.Mock).mockResolvedValue({
      ...mockInterview,
      interview_status: interviewStatusType.CANCELED,
    })

    const result = await service.cancelInterview(1)
    expect(result.interview_status).toBe(interviewStatusType.CANCELED)
  })

  it('should throw error if cancelInterview not found', async () => {
    ;(service['interviewRepository'].findOne as jest.Mock).mockResolvedValue(
      null,
    )
    await expect(service.cancelInterview(1)).rejects.toThrow(ApiError)
  })

  it('should get planned interviews for HR/ADMIN/TEAMLEAD', async () => {
    const mockEmployee = { employee_id: 1 }
    const mockRole = [{ role_name: RoleType.HR }]
    const mockInterviews = [{ interview_id: 1 }]

    mockEmployeeService.getCleanEmployee.mockResolvedValue(mockEmployee)
    ;(service['roleRepository'].find as jest.Mock).mockResolvedValue(mockRole)
    ;(service['interviewRepository'].find as jest.Mock).mockResolvedValue(
      mockInterviews,
    )

    const result = await service.getPlannedInterviews(1)
    expect(result).toEqual(mockInterviews)
  })

  it('should get planned interviews for regular employee', async () => {
    const mockEmployee = { employee_id: 1 }
    ;(service['roleRepository'].find as jest.Mock).mockResolvedValue([])
    ;(service['interviewRepository'].find as jest.Mock).mockResolvedValue([
      { interview_id: 2 },
    ])
    mockEmployeeService.getCleanEmployee.mockResolvedValue(mockEmployee)

    const result = await service.getPlannedInterviews(1)
    expect(result).toEqual([{ interview_id: 2 }])
  })

  it('should get interviews by company', async () => {
    const mockCompany = { company_id: 1 }
    const mockInterviews = [{ interview_id: 1 }]
    mockCompanyService.getCompanyInfo.mockResolvedValue(mockCompany)
    ;(service['interviewRepository'].find as jest.Mock).mockResolvedValue(
      mockInterviews,
    )

    const result = await service.getInterviews(1)
    expect(result).toEqual(mockInterviews)
  })

  it('should throw error if getInterviews not found', async () => {
    const mockCompany = { company_id: 1 }
    mockCompanyService.getCompanyInfo.mockResolvedValue(mockCompany)
    ;(service['interviewRepository'].find as jest.Mock).mockResolvedValue(null)

    await expect(service.getInterviews(1)).rejects.toThrow(ApiError)
  })
})
