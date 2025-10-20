import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { SkillService } from 'src/SkillModule/skill.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';

interface createCompanyBodyDto {
    company_name: string
}

interface createSkillBodyDto {
    skill_name: string
    skill_desc: string
    company_id: number
}

interface giveSkillBodyDto {
    skill_shape_id: number
    company_id: number
    employee_to_give_id: number
}

@Controller('company')
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly employeeService: EmployeeService,
        private readonly skillService : SkillService
    ) { }

    @Get('/:id/info')
    async getCompanyInfo(@Param('id') companyId: number, @Req() req: Request): Promise<Company> {
        const employeeId = (req as any).employee.employee_id

        const employee = await this.companyService.checkEmployee(companyId, employeeId)

        const company = await this.companyService.getCompanyInfo(companyId)

        return company
    }

    @Get('/:id/employees')
    async getEmployees(@Param('id') companyId: number, @Req() req: Request): Promise<employeePayloadDto[]> {
        const employeeId = (req as any).employee.employee_id

        const employee = await this.companyService.checkEmployee(companyId, employeeId)

        const employees = await this.companyService.getEmployees(companyId)

        return employees
    }

    @Get('/:id/skills')
    async getCompanySkills(@Param('id') companyId: number, @Req() req: Request): Promise<SkillShape[]> {
        const employeeId = (req as any).employee.employee_id

        const employee = await this.companyService.checkEmployee(companyId, employeeId)

        const skills = await this.companyService.getSkills(companyId)

        return skills
    }

    @Post('/create')
    async createCompany(@Body() createCompanyBody: createCompanyBodyDto, @Req() req: Request): Promise<Company> {
        const employeeId = (req as any).employee.employee_id       
        const company = await this.companyService.createCompany(createCompanyBody.company_name, employeeId)
    
        return company
    }

    @Post('/skill/create')
    async createSkill(@Body() createSkillBody: createSkillBodyDto, @Req() req: Request): Promise<SkillShape> {
        const employeeId = (req as any).employee.employee_id

        const { skill_name, skill_desc, company_id } = createSkillBody

        const employee = await this.companyService.checkEmployee(company_id, employeeId)

        const skill = await this.skillService.createSkill(skill_name, skill_desc, company_id)

        return skill
    }

    @Post('/skill/give')
    async giveSkillToEmployee(@Body() giveSkillBody: giveSkillBodyDto, @Req() req: Request): Promise<Skill> {
        const employeeId = (req as any).employee.employee_id
        const { skill_shape_id, company_id, employee_to_give_id } = giveSkillBody
        const employee = await this.companyService.checkEmployee(company_id, employeeId)
        const employeeToGive = await this.employeeService.getEmployee(employee_to_give_id)

        const skill = await this.skillService.giveSkill(employeeToGive, skill_shape_id)

        return skill
    }
}