import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Team } from './team.entity'
import { CompanyService } from 'src/CompanyModule/company.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { Employee } from 'src/EmployeeModule/employee.entity'
import ApiError from 'src/apiError'
import { RoleType } from 'src/types'
import { Role } from 'src/EmployeeModule/role.entity'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private companyService: CompanyService,
    private employeeService: EmployeeService,
  ) {}

  async removeTeam(teamId: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: {
        team_id: teamId
      }
    })

    if (!team) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Команда не найдена!')
    }

    const employees = await this.employeeRepository.find({
      where: {
        team: team
      }
    })

    employees.forEach(el => {
      el.team = null
    })

    await this.employeeRepository.save(employees)
    const teamData = await this.teamRepository.remove(team)

    return teamData
  }

  async getTeamsByCompany(companyId: number): Promise<Team[]> {
    const teams = await this.teamRepository.find({
      where: {
        company: {
          company_id: companyId
        }
      },
      relations: {
        employees: {
          role: true
        }
      }
    })

    return teams
  }

  async addTeam(
    companyId: number,
    teamName: string,
    teamDesc: string | null,
    teamlead_id: number,
  ): Promise<Team> {
    try {
      const company = await this.companyService.getCompanyInfo(companyId)
      const teamlead = await this.employeeService.getEmployee(teamlead_id)
      const role = await this.employeeService.getEmployeeRoleById(teamlead_id)

      const team = new Team({
        team_name: teamName,
        team_desc: teamDesc ? teamDesc : undefined,
        teamlead: teamlead,
        company: company,
      })

      const teamData = await this.teamRepository.save(team)

      const teamleadData = await this.addEmployeeToTeam(
        teamData.team_id,
        teamData.teamlead.employee_id,
      )

      role.role_name = RoleType.TEAMLEAD
      await this.roleRepository.save(role)

      return teamData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async addEmployeeToTeam(
    teamId: number,
    employeeId: number,
  ): Promise<Employee> {
    try {
      const employee = await this.employeeService.getEmployee(employeeId)
      const team = await this.teamRepository.findOne({
        where: {
          team_id: teamId,
        },
        relations: {
          employees: true,
        },
      })

      if (!team) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Команда не найдена!')
      }

      employee.team = team

      const employeeData = await this.employeeRepository.save(employee)

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getTeamEmployees(employeeId: number): Promise<Employee[]> {
    try {
      const employee = await this.employeeService.getEmployee(employeeId)
      
      if (employee.team == null) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Пользователь не состоит в команде!')
      }

      const employees = await this.employeeService.getEmployeesByTeam(employee.team.team_id)

      return employees
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getTeam(employeeId: number): Promise<Team> {
    try {
      const employee = await this.employeeService.getEmployee(employeeId)

      if (employee.team == null) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Пользователь не состоит в команде!')
      }

      const team = await this.teamRepository.findOne({
        where: {
          team_id: employee.team.team_id,
        },
        relations: {
          teamlead: true,
          employees: {
            role: true,
          },
          company: true,
        },
      })

      if (!team) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Команда не найдена!')
      }

      return team
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
