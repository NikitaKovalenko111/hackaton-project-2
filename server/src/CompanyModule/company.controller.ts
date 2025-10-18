import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';

interface createCompanyBodyDto {
    company_name: string
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
}