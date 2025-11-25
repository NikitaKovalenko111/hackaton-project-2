import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from 'src/TeamModule/team.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from 'src/TeamModule/team.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { CompanyService } from 'src/CompanyModule/company.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import ApiError from 'src/apiError';

describe('TeamService', () => {
  let service: TeamService;

  const mockTeamRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockEmployeeRepo = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockCompanyService = {
    getCompanyInfo: jest.fn(),
  };

  const mockEmployeeService = {
    getEmployee: jest.fn(),
    getEmployeesByTeam: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeTeam', () => {
    it('should remove a team and unassign employees', async () => {
      const team = { team_id: 1 } as Team;
      const employees = [{ team: team }, { team: team }] as Employee[];

      mockTeamRepo.findOne.mockResolvedValue(team);
      mockEmployeeRepo.find.mockResolvedValue(employees);
      mockEmployeeRepo.save.mockResolvedValue(employees);
      mockTeamRepo.remove.mockResolvedValue(team);

      const result = await service.removeTeam(1);

      expect(mockTeamRepo.findOne).toHaveBeenCalledWith({ where: { team_id: 1 } });
      expect(mockEmployeeRepo.save).toHaveBeenCalledWith(employees);
      expect(mockTeamRepo.remove).toHaveBeenCalledWith(team);
      expect(result).toEqual(team);
    });

    it('should throw error if team not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);
      await expect(service.removeTeam(1)).rejects.toThrow(ApiError);
    });
  });

  describe('addTeam', () => {
    it('should create a new team and add teamlead', async () => {
      const company = { company_id: 1 };
      const teamlead = { employee_id: 2 } as Employee;
      const teamSaved = { team_id: 3, teamlead: teamlead } as Team;

      mockCompanyService.getCompanyInfo.mockResolvedValue(company);
      mockEmployeeService.getEmployee.mockResolvedValue(teamlead);
      mockTeamRepo.save.mockResolvedValue(teamSaved);
      service.addEmployeeToTeam = jest.fn().mockResolvedValue(teamlead);

      const result = await service.addTeam(1, 'Team A', 'desc', 2);

      expect(result).toEqual(teamSaved);
      expect(mockCompanyService.getCompanyInfo).toHaveBeenCalledWith(1);
      expect(service.addEmployeeToTeam).toHaveBeenCalledWith(teamSaved.team_id, teamlead.employee_id);
    });

    it('should throw error if companyService fails', async () => {
      mockCompanyService.getCompanyInfo.mockRejectedValue(new Error('Company error'));
      await expect(service.addTeam(1, 'Team A', 'desc', 2)).rejects.toThrow(ApiError);
    });
  });

  describe('addEmployeeToTeam', () => {
    it('should assign employee to a team', async () => {
      const employee = { employee_id: 1 } as Employee;
      const team = { team_id: 2, employees: [] } as Team;

      mockEmployeeService.getEmployee.mockResolvedValue(employee);
      mockTeamRepo.findOne.mockResolvedValue(team);
      mockEmployeeRepo.save.mockResolvedValue(employee);

      const result = await service.addEmployeeToTeam(2, 1);

      expect(employee.team).toEqual(team);
      expect(result).toEqual(employee);
    });

    it('should throw error if team not found', async () => {
      mockEmployeeService.getEmployee.mockResolvedValue({} as Employee);
      mockTeamRepo.findOne.mockResolvedValue(null);

      await expect(service.addEmployeeToTeam(1, 1)).rejects.toThrow(ApiError);
    });
  });

  describe('getTeamEmployees', () => {
    it('should return employees of the team', async () => {
      const team = { team_id: 1 } as Team;
      const employee = { employee_id: 1, team } as Employee;
      const employees = [{ employee_id: 2 }] as Employee[];

      mockEmployeeService.getEmployee.mockResolvedValue(employee);
      mockEmployeeService.getEmployeesByTeam.mockResolvedValue(employees);

      const result = await service.getTeamEmployees(1);

      expect(result).toEqual(employees);
    });

    it('should throw error if employee not in a team', async () => {
      mockEmployeeService.getEmployee.mockResolvedValue({ team: null } as Employee);
      await expect(service.getTeamEmployees(1)).rejects.toThrow(ApiError);
    });
  });

  describe('getTeam', () => {
    it('should return team info with relations', async () => {
      const team = { team_id: 1 } as Team;
      const employee = { employee_id: 1, team } as Employee;

      mockEmployeeService.getEmployee.mockResolvedValue(employee);
      mockTeamRepo.findOne.mockResolvedValue(team);

      const result = await service.getTeam(1);

      expect(result).toEqual(team);
    });

    it('should throw error if employee not in a team', async () => {
      mockEmployeeService.getEmployee.mockResolvedValue({ team: null } as Employee);
      await expect(service.getTeam(1)).rejects.toThrow(ApiError);
    });
  });
});
