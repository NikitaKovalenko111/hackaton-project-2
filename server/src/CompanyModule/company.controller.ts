import { Body, Controller, Get, HttpException, Post, Query, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { SkillService } from 'src/SkillModule/skill.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { employeeDto, RoleType, skillLevel } from 'src/types';

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

interface giveSkillToManyBodyDto {
    skill_shape_id: number
    company_id: number
    employees_to_give_id: number[]
    skill_level: skillLevel
}

interface giveRoleBodyDto {
    company_id: number
    employee_to_give_id: number
    role_name: RoleType
}

interface addEmployeeByEmailBodyDto {
    company_id: number
    employee_to_add_email: string
    employee_role: RoleType
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
        try {
            const employee = (req as any).employee
    
            const company = await this.companyService.getCompanyInfo(employee.company.company_id)
    
            return company
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/employees')
    async getEmployees(@Req() req: Request, @Query() query: Record<string, any>): Promise<employeePayloadDto[]> {
        try {
            const employee = (req as any).employee
            const { name } = query
    
            const employeeData = await this.employeeService.getEmployee(employee.employee_id)     
    
            const employees = await this.companyService.getEmployees(employeeData.company.company_id, name)
    
            return employees
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/skills')
    async getCompanySkills(@Req() req: Request): Promise<SkillShape[]> {
        try {
            const employee = (req as any).employee

            const employeeData = await this.employeeService.getEmployee(employee.employee_id)
    
            const skills = await this.companyService.getSkills(employeeData.company.company_id)
    
            return skills
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/create')
    async createCompany(@Body() createCompanyBody: createCompanyBodyDto, @Req() req: Request): Promise<Company> {
        try {
            const employeeId = (req as any).employee.employee_id       
            const company = await this.companyService.createCompany(createCompanyBody.company_name, employeeId)
        
            return company
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    /*@Post('/role/give')
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
    }*/

    @Post('/employee/add')
    async addEmployee(@Body() addEmployeeBody: addEmployeeBodyDto, @Req() req: Request): Promise<employeeDto> {
        try {
            const employeeId = (req as any).employee.employee_id
    
            const { company_id, employee_to_add_id, employee_role } = addEmployeeBody
    
            const addedEmployee = await this.companyService.addEmployee(company_id, employee_to_add_id, employee_role)
    
            const employeeData = new employeeDto(addedEmployee)
    
            return employeeData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/employee/addByEmail')
    async addEmployeeByEmail(@Body() addEmployeeByEmailBody: addEmployeeByEmailBodyDto, @Req() req: Request): Promise<employeeDto> {
        try {
            const employeeId = (req as any).employee.employee_id
    
            const { company_id, employee_to_add_email, employee_role } = addEmployeeByEmailBody
    
            const addedEmployee = await this.companyService.addEmployeeByEmail(company_id, employee_to_add_email, employee_role)
    
            const employeeData = new employeeDto(addedEmployee)
    
            return employeeData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/skill/create')
    async createSkill(@Body() createSkillBody: createSkillBodyDto, @Req() req: Request): Promise<SkillShape> {
        try {
            const employeeId = (req as any).employee.employee_id
    
            const { skill_name, skill_desc, company_id } = createSkillBody
    
            const skill = await this.skillService.createSkill(skill_name, skill_desc, company_id)
    
            return skill
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/skill/give')
    async giveSkillToEmployee(@Body() giveSkillBody: giveSkillBodyDto, @Req() req: Request): Promise<Skill> {
        try {
            const employeeId = (req as any).employee.employee_id
            const { skill_shape_id, company_id, employee_to_give_id, skill_level } = giveSkillBody
            const employeeToGive = await this.employeeService.getEmployee(employee_to_give_id)
    
            const skill = await this.skillService.giveSkill(employeeToGive, skill_shape_id, skill_level)
    
            return skill
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/skill/giveToMany')
    async giveSkillToEmployees(@Body() giveSkillBody: giveSkillToManyBodyDto, @Req() req: Request): Promise<Skill[]> {
        try {
            const employeeId = (req as any).employee.employee_id
            const { skill_shape_id, company_id, employees_to_give_id, skill_level } = giveSkillBody
            const employeesInCompany = await this.companyService.getEmployees(company_id, )
            const needEmployees = employeesInCompany.filter(el => employees_to_give_id.includes(el.employee_id))
    
            const skill = await this.skillService.giveSkillToMany(needEmployees, skill_shape_id, skill_level)
    
            return skill
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}