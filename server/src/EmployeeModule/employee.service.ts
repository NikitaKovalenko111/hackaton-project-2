import { HttpStatus, Injectable } from '@nestjs/common'
import {
  employeePayloadDto,
  type authEmployeeBodyDto,
  type authEmployeeTgBodyDto,
  type changeProfileDataBodyDto,
  type registerEmployeeBodyDto,
  type registerEmployeeReturnDto,
} from './employee.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Employee } from './employee.entity'
import { Repository } from 'typeorm'
import bcrypt from 'bcrypt'
import { TokenService } from './token.service'
import { employeeDto } from 'src/types'
import ApiError from 'src/apiError'
import { Role } from './role.entity'

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private tokenService: TokenService,
  ) {}

  async getEmployeesByTeam(teamId: number): Promise<Employee[]> {
    const employees = await this.employeeRepository.find({
      where: {
        team: {
          team_id: teamId,
        },
      },
      relations: {
        team: true,
        role: true,
      },
    })

    return employees
  }

  async updateProfile(
    newProfileData: changeProfileDataBodyDto,
    employeeId: number,
  ): Promise<Employee> {
    try {
      const { employee_email, employee_name, employee_surname } = newProfileData

      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employeeId,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      employee.employee_name = employee_name
        ? employee_name
        : employee.employee_name
      employee.employee_surname = employee_surname
        ? employee_surname
        : employee.employee_surname
      employee.employee_email = employee_email
        ? employee_email
        : employee.employee_email

      const employeeData = await this.employeeRepository.save(employee)

      return employeeData
    } catch (error) {
      throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, error)
    }
  }

  async changePassword(
    newPassword: string,
    oldPassword: string,
    employeeId: number,
  ): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employeeId,
        },
        select: {
          employee_password: true,
          employee_id: true,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Пользователь не найден!')
      }

      const isPassCorrect = await bcrypt.compare(
        oldPassword,
        employee.employee_password,
      )

      if (!isPassCorrect) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Неверный пароль!')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 3)

      employee.employee_password = hashedPassword

      const employeeData = await this.employeeRepository.save(employee)

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getEmployeeByEmail(email: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_email: email,
        },
      })

      if (!employee) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          'Пользователь с таким Email не найден!',
        )
      }

      return employee
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getEmployee(employeeId: number) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employeeId,
        },
        select: {},
        relations: {
          skills: {
            skill_shape: true,
          },
          team: {
            employees: {
              role: true,
            },
            teamlead: true,
          },
          company: true,
          role: true,
          plannedInterviews: true,
          receivedRequests: true,
          sendedRequests: true,
          createdInterviews: true,
        },
      })

      console.log(employee)

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      return employee
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getCleanEmployee(employeeId: number): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employeeId,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      return employee
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async setStatus(status: string, employee_id: number): Promise<string> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employee_id,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      employee.employee_status = status

      const employeeData = await this.employeeRepository.save(employee)

      return employeeData.employee_status
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async uploadPhoto(file: Express.Multer.File, employee_id: number) {
    try {
      const filename =
        String(employee_id) + '.' + String(file.mimetype.split('/')[1])

      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: employee_id,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      employee.employee_photo = filename

      const employeeData = await this.employeeRepository.save(employee)

      return employeeData.employee_photo
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async registration(
    data: registerEmployeeBodyDto,
  ): Promise<registerEmployeeReturnDto> {
    try {
      const email = data.employee_email
      const name = data.employee_name
      const surname = data.employee_surname
      const password = data.employee_password

      const candidate = await this.employeeRepository.findOne({
        where: {
          employee_email: email,
        },
      })

      if (candidate) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          'Пользователь с таким email уже существует!',
        )
      }

      const hashPassword = await bcrypt.hash(password, 3)

      const employee = new Employee({
        employee_email: email,
        employee_name: name,
        employee_surname: surname,
        employee_password: hashPassword,
      })

      const employeeCurrent = await this.employeeRepository.save(employee)

      const employeeData = new employeePayloadDto(employeeCurrent)

      const tokens = this.tokenService.generateTokens({
        employee_id: employeeData.employee_id,
        employee_email: employeeData.employee_email,
        employee_name: employeeData.employee_name,
        employee_photo: employeeData.employee_photo,
        employee_status: employeeData.employee_status,
        employee_surname: employeeData.employee_surname,
      })

      await this.tokenService.saveToken(
        employeeData.employee_id,
        tokens.refreshToken,
      )

      return {
        ...tokens,
        payload: {
          ...employeeData,
        },
      }
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async authorization(data: authEmployeeBodyDto) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_email: data.employee_email,
        },
        select: {
          employee_id: true,
          employee_password: true,
          employee_name: true,
          employee_email: true,
          employee_surname: true,
          company: true,
          role: true,
        },
        relations: {
          company: true,
          role: true,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Сотрудник не найден!')
      }

      const isPassCorrect = await bcrypt.compare(
        data.employee_password,
        employee.employee_password,
      )

      if (!isPassCorrect) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Неверный пароль!')
      }

      const tokens = this.tokenService.generateTokens(
        JSON.parse(JSON.stringify(employee)),
      )
      const refreshTokenDb = this.tokenService.saveToken(
        employee.employee_id,
        tokens.refreshToken,
      )

      const employeeData = new employeeDto(employee)

      return {
        ...tokens,
        payload: {
          ...employeeData,
        },
      }
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async authorizationTg(data: authEmployeeTgBodyDto) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_email: data.employee_email,
        },
        select: {
          employee_id: true,
          employee_password: true,
          employee_name: true,
          employee_email: true,
          employee_surname: true,
        },
      })

      if (!employee) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          'Пользователя с таким email не существует!',
        )
      }

      const isPassCorrect = await bcrypt.compare(
        data.employee_password,
        employee.employee_password,
      )

      if (!isPassCorrect) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Неверный пароль!')
      }

      const previousEmployee = await this.employeeRepository.findOne({
        where: {
          telegram_id: data.tg_id,
        },
      })

      if (previousEmployee) {
        previousEmployee.telegram_id = null

        await this.employeeRepository.save(previousEmployee)
      }

      employee.telegram_id = data.tg_id

      const employeeData = await this.employeeRepository.save(employee)

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async logout(refreshToken: string): Promise<string> {
    try {
      const token = this.tokenService.removeToken(refreshToken)

      return token
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getEmployeeByTgId(id: number): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          telegram_id: id,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'Вы не авторизованы!')
      }

      return employee
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: id,
        },
        relations: {
          skills: {
            skill_shape: true,
          },
          team: {
            employees: true,
            teamlead: true,
          },
          company: true,
          role: true,
          plannedInterviews: true,
          receivedRequests: true,
          sendedRequests: true,
          createdInterviews: true,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Пользователь не найден!')
      }

      return employee
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getEmployeeRoleById(employeeId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        employee: {
          employee_id: employeeId,
        },
      },
      relations: {
        employee: true,
      },
    })

    if (!role) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Роль не найдена!')
    }

    return role
  }

  async refresh(
    refreshToken: string | null,
  ): Promise<registerEmployeeReturnDto> {
    try {
      if (!refreshToken) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'Вы не авторизованы!')
      }

      const employeeData = this.tokenService.validateRefreshToken(refreshToken)

      const dbToken = await this.tokenService.findToken(refreshToken)

      if (!dbToken || !employeeData) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'Вы не авторизованы!')
      }

      const employee = await this.employeeRepository.findOne({
        where: {
          employee_id: (employeeData as any).employee_id,
        },
        relations: {
          skills: true,
          team: true,
          company: true,
          role: true,
        },
      })

      if (!employee) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Пользователь не найден!')
      }

      const employeePayload = new employeePayloadDto(employee)

      const tokens = await this.tokenService.generateTokens(employeePayload)

      return {
        ...tokens,
        payload: employeePayload,
      }
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
