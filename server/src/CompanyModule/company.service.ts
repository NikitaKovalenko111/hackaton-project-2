import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,

        @InjectRepository(SkillShape)
        private skillShapeRepository: Repository<SkillShape>,

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
        const employee = await this.employeeService.getEmployee(employee_id)
        company.addEmployee(employee)

        const companyData = await this.companyRepository.save(company)

        return companyData
    }

    async createSkill(skillName: string, skillDesc: string, companyId: number): Promise<SkillShape> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId
            }
        })
        if (!company) {
            throw new Error("Компания не найдена")
        }
        const skill = new SkillShape({
            skill_name: skillName,
            skill_desc: skillDesc
        })

        company.addSkill(skill)

        await this.companyRepository.save(company)

        return skill
    }
}
