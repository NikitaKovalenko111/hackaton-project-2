import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';
import { SkillShape } from 'src/SkillModule/skillShape.entity';

interface createCompanyBodyDto {
    company_name: string
}

interface createSkillBodyDto {
    skill_name: string
    skill_desc: string
    company_id: number
}

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Get('/:id/employees')
    async getEmployees(@Param('id') companyId: number, @Req() req: Request): Promise<employeePayloadDto[]> {
        const employeeId = (req as any).employee.employee_id

        const employee = await this.companyService.checkEmployee(companyId, employeeId)

        const employees = await this.companyService.getEmployees(companyId)

        return employees
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

        const skill = await this.companyService.createSkill(skill_name, skill_desc, company_id)

        return skill
    }
}