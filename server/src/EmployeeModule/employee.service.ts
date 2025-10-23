import { Injectable } from '@nestjs/common';
import { authEmployeeBodyDto, authEmployeeTgBodyDto, registerEmployeeBodyDto, registerEmployeeReturnDto } from './employee.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { TokenService } from './token.service';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,

        private tokenService: TokenService
    ) {}

    async getEmployee(employeeId: number) {
        const employee = await this.employeeRepository.findOne({
            where: {
                employee_id: employeeId
            },
            relations: {
                skills: {
                    skill_shape: true
                },
                team: {
                    teamlead: true,
                },
                company: true,
                roles: true,
            }
        })

        if (!employee) {
            throw new Error("Пользователь не найден")
        }

        return employee
    }

    async setStatus(status: string, employee_id: number): Promise<string> {
        const employee = await this.employeeRepository.findOne({
            where: {
                employee_id: employee_id
            }
        })

        if (!employee) {
            throw new Error('Пользователь не найден')
        }

        employee.employee_status = status

        const employeeData = await this.employeeRepository.save(employee)

        return employeeData.employee_status
    }

    async uploadPhoto(file: Express.Multer.File, employee_id: number) {
        const filename = String(employee_id) + '.' + String(file.mimetype.split("/")[1])
        const employee = await this.employeeRepository.findOne({
            where: {
                employee_id: employee_id
            }
        })

        if (!employee) {
            throw new Error('Пользователь не найден')
        }

        employee.employee_photo = filename

        const employeeData = await this.employeeRepository.save(employee)

        return employeeData.employee_photo
    }

    async registration(data: registerEmployeeBodyDto): Promise<registerEmployeeReturnDto> {
        const email = data.employee_email
        const name = data.employee_name
        const surname = data.employee_surname
        const password = data.employee_password

        const candidate = await this.employeeRepository.findOne({
            where: {
                employee_email: email
            }
        })

        if (candidate) {
            throw new Error('Аккаунт с такой почтой уже существует!')
        }

        const hashPassword = await bcrypt.hash(password, 3)

        const employee = new Employee({
            employee_email: email,
            employee_name: name,
            employee_surname: surname,
            employee_password: hashPassword
        })

        const employeeCurrent = await this.employeeRepository.save(employee)     

        const employeeData = {
            employee_id: employeeCurrent.employee_id,
            employee_name: employeeCurrent.employee_name,
            employee_surname: employeeCurrent.employee_surname,
            employee_photo: employeeCurrent.employee_photo,
            employee_status: employeeCurrent.employee_status,
            employee_email: employeeCurrent.employee_email,
            company: employeeCurrent.company,
            team: employeeCurrent.team,
            employeeRoles: employeeCurrent.roles,
            employeeSkills: employeeCurrent.skills
        }

        const tokens = this.tokenService.generateTokens(employeeData)

        await this.tokenService.saveToken(employeeData.employee_id, tokens.refreshToken)

        return {
            ...tokens,
            payload: {
                ...employeeData
            }
        }
    }

    async authorization(data: authEmployeeBodyDto) {
        const employee = await this.employeeRepository.findOne({
            where: {
                employee_email: data.employee_email
            },
            relations: {
                skills: true,
                team: true,
                company: true,
                roles: true,
            }
        })

        if (!employee) {
            throw new Error('Пользователя с таким email не существует!')
        }

        const isPassCorrect = bcrypt.compare(data.employee_password, employee.employee_password)

        if (!isPassCorrect) {
            throw new Error('Неверный пароль')
        }

        const employeeData = {
            employee_id: employee.employee_id,
            employee_name: employee.employee_name,
            employee_surname: employee.employee_surname,
            employee_photo: employee.employee_photo,
            employee_status: employee.employee_status,
            employee_email: employee.employee_email,
            company: employee.company,
            team: employee.team,
            employeeRoles: employee.roles,
            employeeSkills: employee.skills
        }  

        const tokens = this.tokenService.generateTokens(employeeData)

        return {
            ...tokens,
            payload: {
                ...employeeData
            }
        }
    }

    async authorizationTg(data: authEmployeeTgBodyDto) {
        const employee = await this.employeeRepository.findOne({
            where: {
                employee_email: data.employee_email
            },
            relations: {
                skills: true,
                team: true,
                company: true,
                roles: true,
            }
        })

        if (!employee) {
            throw new Error('Пользователя с таким email не существует!')
        }

        const isPassCorrect = bcrypt.compare(data.employee_password, employee.employee_password)

        if (!isPassCorrect) {
            throw new Error('Неверный пароль')
        }

        employee.telegram_id = data.tg_id

        const employeeData = await this.employeeRepository.save(employee)

        const employeeDataI = {
            employee_id: employeeData.employee_id,
            employee_name: employeeData.employee_name,
            employee_surname: employeeData.employee_surname,
            employee_photo: employeeData.employee_photo,
            employee_status: employeeData.employee_status,
            employee_email: employeeData.employee_email,
            company: employeeData.company,
            team: employeeData.team,
            employeeRoles: employeeData.roles,
            employeeSkills: employeeData.skills
        }

        return employeeDataI
    }

    async logout(refreshToken: string): Promise<string> {
        const token = this.tokenService.removeToken(refreshToken)

        return token
    }

    async refresh(refreshToken: string | null): Promise<registerEmployeeReturnDto> {
        if (!refreshToken) {
            throw new Error('Вы не авторизованы')
        }

        const employeeData = this.tokenService.validateRefreshToken(refreshToken)

        const dbToken = await this.tokenService.findToken(refreshToken)

        if (!dbToken || !employeeData) {
            throw new Error('Вы не авторизованы')
        }

        const employee = await this.employeeRepository.findOne({
            where: {
                employee_id: (employeeData as any).employee_id
            },
            relations: {
                skills: true,
                team: true,
                company: true,
                roles: true,
            }
        })

        if (!employee) {
            throw new Error('Пользователя не существует')
        }

        const employeePayload = {
            employee_id: employee.employee_id,
            employee_name: employee.employee_name,
            employee_surname: employee.employee_surname,
            employee_photo: employee.employee_photo,
            employee_status: employee.employee_status,
            employee_email: employee.employee_email,
            company: employee.company,
            team: employee.team,
            employeeRoles: employee.roles,
            employeeSkills: employee.skills
        }

        const tokens = await this.tokenService.generateTokens(employeePayload)

        return {
            ...tokens,
            payload: employeePayload
        }
    }
}
