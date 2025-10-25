import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillShape } from './skillShape.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';

@Module({
    imports: [
        EmployeeModule,
        TypeOrmModule.forFeature([Skill, SkillShape, Company, Employee, Employee_token])
    ],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService]
})

export class SkillModule { }