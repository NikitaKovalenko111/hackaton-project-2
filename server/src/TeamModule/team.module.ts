import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './team.service';
import { Team } from './team.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { Role } from 'src/EmployeeModule/role.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { CompanyModule } from 'src/CompanyModule/company.module';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';

@Module({
    imports: [
        CompanyModule,
        EmployeeModule,
        TypeOrmModule.forFeature([Team, Employee, Company, Role, Employee_token])
    ],
    controllers: [TeamController],
    providers: [TeamService],
    exports: [TeamService]
})

export class TeamModule { }