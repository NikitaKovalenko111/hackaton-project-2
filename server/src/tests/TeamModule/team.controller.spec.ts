import { Test, TestingModule } from '@nestjs/testing'
import { TeamController } from 'src/TeamModule/team.controller'
import { TeamService } from 'src/TeamModule/team.service'
import { Team } from 'src/TeamModule/team.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { employeeDto } from 'src/types'

describe('TeamController', () => {
  let controller: TeamController
  let service: TeamService

  const mockTeamService = {
    removeTeam: jest.fn(),
    getTeam: jest.fn(),
    getTeamEmployees: jest.fn(),
    addTeam: jest.fn(),
    addEmployeeToTeam: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [{ provide: TeamService, useValue: mockTeamService }],
    }).compile()

    controller = module.get<TeamController>(TeamController)
    service = module.get<TeamService>(TeamService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should remove a team', async () => {
    const mockTeam = {} as Team
    mockTeamService.removeTeam.mockResolvedValue(mockTeam)

    const result = await controller.removeTeamById(1)

    expect(result).toEqual(mockTeam)
    expect(service.removeTeam).toHaveBeenCalledWith(1)
  })

  it('should get team info', async () => {
    const mockTeam = {} as Team
    mockTeamService.getTeam.mockResolvedValue(mockTeam)

    const req = { employee: { employee_id: 1 } } as any
    const result = await controller.getTeamInfo(req)

    expect(result).toEqual(mockTeam)
    expect(service.getTeam).toHaveBeenCalledWith(1)
  })

  it('should get team employees', async () => {
    const mockEmployees = [{} as Employee]
    mockTeamService.getTeamEmployees.mockResolvedValue(mockEmployees)

    const req = { employee: { employee_id: 1 } } as any
    const result = await controller.getTeamEmployees(req)

    expect(result).toEqual(mockEmployees)
    expect(service.getTeamEmployees).toHaveBeenCalledWith(1)
  })

  it('should add a new team', async () => {
    const mockTeam = {} as Team
    mockTeamService.addTeam.mockResolvedValue(mockTeam)

    const req = { employee: { employee_id: 1 } } as any
    const dto = {
      company_id: 1,
      team_name: 'Team A',
      team_desc: 'Description',
      teamlead_id: 2,
    }

    const result = await controller.addTeam(dto, req)

    expect(result).toEqual(mockTeam)
    expect(service.addTeam).toHaveBeenCalledWith(
      dto.company_id,
      dto.team_name,
      dto.team_desc,
      dto.teamlead_id,
    )
  })

  it('should add employee to team and return employeeDto', async () => {
    const mockEmployee = { id: 1, name: 'John' } as any
    mockTeamService.addEmployeeToTeam.mockResolvedValue(mockEmployee)

    const req = { employee: { employee_id: 1 } } as any
    const dto = { team_id: 1, employee_to_add_id: 2 }

    const result = await controller.addEmployeeToTeam(dto, req)

    expect(result).toEqual(new employeeDto(mockEmployee))
    expect(service.addEmployeeToTeam).toHaveBeenCalledWith(
      dto.team_id,
      dto.employee_to_add_id,
    )
  })
})
