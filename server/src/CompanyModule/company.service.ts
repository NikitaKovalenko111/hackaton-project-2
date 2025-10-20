import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,

        @InjectRepository(SkillShape)
        private skillShapeRepository: Repository<SkillShape>,

        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,

        private employeeService: EmployeeService
    ) {}

    async checkEmployee(company_id: number, employeeId: number) {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: company_id
            },
            relations: {
                employees: true
            }
        })  

        const employee = company?.employees.find(employee => employee.employee_id == employeeId)

        if (!employee) {
            throw new Error('Сотрудник не в компании!')
        }

        return employee
    }

    async getCompanyInfo(companyId: number): Promise<Company> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId
            },
            relations: {
                employees: true,
                skills: true
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
                employees: true
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

        return companyData
    }
}
