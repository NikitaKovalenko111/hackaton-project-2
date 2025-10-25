import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';
import { SkillModule } from 'src/SkillModule/skill.module';
import { Statistics } from './statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { CompanyModule } from 'src/CompanyModule/company.module';

@Module({
    imports: [
        EmployeeModule,
        SkillModule,
        CompanyModule,
        TypeOrmModule.forFeature([Statistics]),
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
    exports: [StatisticsService]
})

export class StatisticsModule { }