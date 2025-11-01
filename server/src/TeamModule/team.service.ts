import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Team } from './team.entity'
import { CompanyService } from 'src/CompanyModule/company.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { Employee } from 'src/EmployeeModule/employee.entity'
import ApiError from 'src/apiError'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,

    private companyService: CompanyService,
    private employeeService: EmployeeService,
  ) {}

  async addTeam(
    companyId: number,
    teamName: string,
    teamDesc: string | null,
    teamlead_id: number,
  ): Promise<Team> {
    try {
      const company = await this.companyService.getCompanyInfo(companyId)
      const teamlead = await this.employeeService.getEmployee(teamlead_id)

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
      /*const history: Employee[] = []
            
            for (let i = 0; i < employee.team.employees.length; i++) {
                const element = employee.team.employees[i]
                
                if (element.employee_id != employee.employee_id) {
                    history.push(element)
                }
            }
            employee.workedWith = history*/

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
