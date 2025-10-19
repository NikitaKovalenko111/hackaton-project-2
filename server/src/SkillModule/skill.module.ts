import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { SkillShape } from './skillShape.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Skill, SkillShape])
    ],
    controllers: [SkillController],
    providers: [SkillService, EmployeeService],
})

export class InterviewModule { }