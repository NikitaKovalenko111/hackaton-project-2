import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';
import { SkillModule } from 'src/SkillModule/skill.module';
import { Statistics } from './statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [
        EmployeeModule,
        SkillModule,
        TypeOrmModule.forFeature([Statistics]),
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
    exports: [StatisticsService]
})

export class StatisticsModule { }