import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { SkillService } from 'src/SkillModule/skill.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { RoleType, skillLevel } from 'src/types';
import { Role } from 'src/EmployeeModule/role.entity';

interface createCompanyBodyDto {
    company_name: string
}

interface createSkillBodyDto {
    skill_name: string
    skill_desc: string
    company_id: number
}

interface addEmployeeBodyDto {
    company_id: number
    employee_to_add_id: number
    employee_role: RoleType
}

interface giveSkillBodyDto {
    skill_shape_id: number
    company_id: number
    employee_to_give_id: number
    skill_level: skillLevel
}

interface giveRoleBodyDto {
    company_id: number
    employee_to_give_id: number
    role_name: RoleType
}

@Controller('company')
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly employeeService: EmployeeService,
        private readonly skillService : SkillService
    ) { }

    @Get('/info')
    async getCompanyInfo(@Req() req: Request): Promise<Company> {
        const employee = (req as any).employee

        const company = await this.companyService.getCompanyInfo(employee.company.company_id)

        return company
    }

    @Get('/employees')
    async getEmployees(@Req() req: Request): Promise<employeePayloadDto[]> {
        const employee = (req as any).employee

        const employees = await this.companyService.getEmployees(employee.company.company_id)

        return employees
    }

    @Get('/skills')
    async getCompanySkills(@Req() req: Request): Promise<SkillShape[]> {
        const employee = (req as any).employee

        const skills = await this.companyService.getSkills(employee.company.company_id)

        return skills
    }

    @Post('/create')
    async createCompany(@Body() createCompanyBody: createCompanyBodyDto, @Req() req: Request): Promise<Company> {
        const employeeId = (req as any).employee.employee_id       
        const company = await this.companyService.createCompany(createCompanyBody.company_name, employeeId)
    
        return company
    }

    @Post('/role/give')
    async giveRole(@Body() giveRoleBody: giveRoleBodyDto, @Req() req: Request): Promise<Role> {
        const employeeId = (req as any).employee.employee_id
        const employee = await this.employeeService.getEmployee(employeeId)

        const { company_id, employee_to_give_id, role_name } = giveRoleBody

        const employeeRole = employee.roles.find(role => (role.role_name == 'admin' && role.company.company_id == company_id))

        if (!employeeRole) {
            throw new Error('У пользователя недостаточно прав!')
        }

        const roleData = await this.companyService.giveRole(company_id, role_name, employee_to_give_id)

        return roleData
    }

    @Post('/employee/add')
    async addEmployee(@Body() addEmployeeBody: addEmployeeBodyDto, @Req() req: Request): Promise<Employee> {
        const employeeId = (req as any).employee.employee_id

        const { company_id, employee_to_add_id, employee_role } = addEmployeeBody

        const addedEmployee = await this.companyService.addEmployee(company_id, employee_to_add_id, employee_role)

        return addedEmployee
    }

    @Post('/skill/create')
    async createSkill(@Body() createSkillBody: createSkillBodyDto, @Req() req: Request): Promise<SkillShape> {
        const employeeId = (req as any).employee.employee_id

        const { skill_name, skill_desc, company_id } = createSkillBody

        const skill = await this.skillService.createSkill(skill_name, skill_desc, company_id)

        return skill
    }

    @Post('/skill/give')
    async giveSkillToEmployee(@Body() giveSkillBody: giveSkillBodyDto, @Req() req: Request): Promise<Skill> {
        const employeeId = (req as any).employee.employee_id
        const { skill_shape_id, company_id, employee_to_give_id, skill_level } = giveSkillBody
        const employeeToGive = await this.employeeService.getEmployee(employee_to_give_id)

        const skill = await this.skillService.giveSkill(employeeToGive, skill_shape_id, skill_level)

        return skill
    }
}