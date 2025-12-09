import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Company } from './company.entity'
import { Like, Repository } from 'typeorm'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { SkillShape } from 'src/SkillModule/skillShape.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { interviewStatusType, requestStatus, RoleType } from 'src/types'
import { Role } from 'src/EmployeeModule/role.entity'
import { Review } from 'src/ReviewModule/review.entity'
import ApiError from 'src/apiError'
import { Team } from 'src/TeamModule/team.entity'

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(SkillShape)
    private skillShapeRepository: Repository<SkillShape>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    private employeeService: EmployeeService,
  ) {}

  async addEmployee(
    companyId: number,
    employeeId: number,
    employeeRole: RoleType,
  ): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employeeId,
        },
      })

      const company = await this.companyRepository.findOne({
        where: {
          company_id: companyId,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      if (!company) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компания не найдена!')
      }

      const roles = await this.roleRepository.find({
        where: {
          employee: {
            employee_id: employeeId,
          },
        },
        relations: {
          employee: true,
        }
      })

      await this.roleRepository.remove(roles)

      employee.company = company

      const employeeData = await this.employeeRepository.save(employee)

      const role = new Role({
        role_name: employeeRole,
        company: company,
        employee: employeeData,
      })

      const roleData = await this.roleRepository.save(role)

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async addEmployeeByEmail(
    companyId: number,
    employeeToAddEmail: string,
    employeeRole: RoleType,
  ) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_email: employeeToAddEmail,
        },
      })

      const company = await this.companyRepository.findOne({
        where: {
          company_id: companyId,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      if (!company) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компания не найдена!')
      }

      employee.company = company

      const employeeData = await this.employeeRepository.save(employee)

      const role = new Role({
        role_name: employeeRole,
        company: company,
        employee: employeeData,
      })

      const roleData = await this.roleRepository.save(role)

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getCompanyInfo(companyId: number): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({
        where: {
          company_id: companyId,
        },
        relations: {
          employees: true,
          skills: true,
          teams: true,
          roles: true,
        },
      })

      if (!company) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компания не найдена!')
      }

      return company
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getEmployees(
    company_id: number,
    name?: string,
    surname?: string,
    email?: string,
  ): Promise<Employee[]> {
    try {
      const employees = await this.employeeRepository.find({
        where: {
          company: {
            company_id: company_id,
          },
          employee_name: Like(`%${name ? name : ''}%`),
          employee_email: Like(`%${email ? email : ''}%`),
          employee_surname: Like(`%${surname ? surname : ''}%`),
        },
        relations: {
          role: true,
          team: {
            teamlead: true,
            employees: true,
          },
          skills: {
            skill_shape: true,
          },
        },
      })

      return employees
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getAllTeams(
    companyId: number,
    teamName: string = '',
    teamleadName: string = '',
    teamleadSurname: string = '',
  ): Promise<Team[]> {
    const teams = await this.teamRepository.find({
      where: {
        company: {
          company_id: companyId,
        },
        team_name: Like(`%${teamName}%`),
        teamlead: {
          employee_name: Like(`%${teamleadName}%`),
          employee_surname: Like(`%${teamleadSurname}%`),
        },
      },
      relations: {
        company: true,
        teamlead: true,
      },
    })

    return teams
  }

  async removeEmployee(employeeId: number): Promise<Employee> {
    const employee = await this.employeeService.getEmployee(employeeId)

    employee.company = null
    employee.team = null
    employee.skills = []
    employee.sendedRequests = employee.sendedRequests.filter(
      (el) => el.request_status != requestStatus.PENDING,
    )
    employee.plannedInterviews = employee.plannedInterviews.filter(
      (el) => el.interview_status != interviewStatusType.PLANNED,
    )

    const employeeData = await this.employeeRepository.save(employee)
    const role = await this.roleRepository.delete({
      employee: employee,
    })

    return employeeData
  }

  async getSkillShapesByCompany(
    companyId: number,
    skillName: string = '',
  ): Promise<SkillShape[]> {
    try {
      const skillShapes = await this.skillShapeRepository.find({
        where: {
          company: {
            company_id: companyId,
          },
          skill_name: Like(`%${skillName}%`),
        },
        relations: {
          company: true,
        },
      })

      return skillShapes
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async createCompany(
    company_name: string,
    employee_id: number,
  ): Promise<Company> {
    try {
      const company = new Company({
        company_name: company_name,
      })

      const companyData = await this.companyRepository.save(company)

      const employee = await this.employeeService.getEmployee(employee_id)
      employee.company = companyData

      const employeeData = await this.employeeRepository.save(employee)

      const role = new Role({
        employee: employeeData,
        role_name: RoleType.ADMIN,
        company: companyData,
      })

      const roleData = await this.roleRepository.save(role)

      const review = new Review({
        company: companyData,
      })

      const reviewData = await this.reviewRepository.save(review)

      return companyData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
