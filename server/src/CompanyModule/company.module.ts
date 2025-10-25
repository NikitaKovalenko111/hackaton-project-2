import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { SkillShape } from 'src/SkillModule/skillShape.entity';
import { Role } from 'src/EmployeeModule/role.entity';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';
import { SkillModule } from 'src/SkillModule/skill.module';
import { Review } from 'src/ReviewModule/review.entity';

@Module({
    imports: [
        EmployeeModule,
        SkillModule,
        TypeOrmModule.forFeature([Company, Employee, Employee_token, Skill, SkillShape, Role, Review]),
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService]
})

export class CompanyModule { }