import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { TokenService } from 'src/EmployeeModule/token.service';
import { Employee_token } from 'src/EmployeeModule/token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company, Employee, Employee_token]),
    ],
    controllers: [CompanyController],
    providers: [CompanyService, EmployeeService, TokenService],
})

export class CompanyModule { }