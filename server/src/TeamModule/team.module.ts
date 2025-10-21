import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './team.service';
import { Team } from './team.entity';
import { CompanyService } from 'src/CompanyModule/company.service';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Company } from 'src/CompanyModule/company.entity';
import { Role } from 'src/EmployeeModule/role.entity';
import { TokenService } from 'src/EmployeeModule/token.service';
import { Employee_token } from 'src/EmployeeModule/token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Team, Employee, Company, Role, Employee_token])
    ],
    controllers: [TeamController],
    providers: [TeamService, CompanyService, EmployeeService, TokenService],
})

export class TeamModule { }