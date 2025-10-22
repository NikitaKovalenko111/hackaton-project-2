import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { SkillShape } from './skillShape.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { TokenService } from 'src/EmployeeModule/token.service';
import { Employee_token } from 'src/EmployeeModule/token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Skill, SkillShape, Company, Employee, Employee_token])
    ],
    controllers: [SkillController],
    providers: [SkillService, EmployeeService, TokenService],
})

export class SkillModule { }