import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { RoleType } from 'src/types';
import { Role } from 'src/EmployeeModule/role.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,

        @InjectRepository(Role)
        private roleRepository: Repository<Role>,

        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,

        private employeeService: EmployeeService
    ) {}

    async giveRole(companyId: number, roleName: RoleType, employeeToGiveId: number): Promise<Role> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId,
            }, 
            relations: {
                employees: true
            }
        })

        if (!company) {
            throw new Error('Компания не найдена')
        }

        const employeeData = company.employees.find(employee => employee.employee_id == employeeToGiveId)

        const role = new Role({
            role_name: roleName,
            company: company,
            employee: employeeData
        })

        const roleData = await this.roleRepository.save(role)

        return roleData
    }

    async addEmployee(companyId: number, employeeId: number, employeeRole: RoleType): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({
            where: {
                employee_id: employeeId
            }
        })

        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId
            }
        })

        if (!employee) {
            throw new Error('Пользователь не найден!')
        }

        if (!company) {
            throw new Error('Компания не найдена!')
        }

        employee.company = company

        const employeeData = await this.employeeRepository.save(employee)

        const role = new Role({
            role_name: employeeRole,
            company: company,
            employee: employeeData
        })

        const roleData = await this.roleRepository.save(role)

        return employeeData
    }

    async getCompanyInfo(companyId: number): Promise<Company> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId
            },
            relations: {
                employees: true,
                skills: true,
                teams: true,
                roles: true
            }
        })

        if (!company) {
            throw new Error("Такой компании не существует!")
        }

        return company
    }

    async getEmployees(company_id: number): Promise<employeePayloadDto[]> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: company_id
            },
            relations: {
                employees: {
                    roles: true,
                    skills: true,
                }
            }
        })

        if (!company) {
            throw new Error('Такой компании не существует')
        }    

        return company.employees
    }

    async getSkills(companyId: number): Promise<SkillShape[]> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId
            },
            relations: {
                skills: true
            }
        })

        if (!company) {
            throw new Error('Такой компании не существует')
        }    

        return company.skills
    }

    async createCompany(company_name: string, employee_id: number): Promise<Company> {
        const company = new Company({
            company_name: company_name
        })

        const companyData = await this.companyRepository.save(company)

        const employee = await this.employeeService.getEmployee(employee_id)
        employee.company = companyData

        const employeeData = await this.employeeRepository.save(employee)

        const role = new Role({
            employee: employeeData,
            role_name: "admin",
            company: companyData
        })

        const roleData = await this.roleRepository.save(role)

        return companyData
    }
}
