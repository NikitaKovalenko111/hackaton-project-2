import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ApiError from 'src/apiError';
import { Statistics } from './statistics.entity';
import { spawn } from 'child_process';
import { CompanyService } from 'src/CompanyModule/company.service';
import { SkillService } from 'src/SkillModule/skill.service';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Statistics)
        private statisticsRepository: Repository<Statistics>,

        private readonly skillService: SkillService
    ) {}

    async generate(companyId: number) {
        const skills = await this.skillService.getSkillsByCompany(companyId)

        const promise = new Promise((resolve, reject) => {
            const statisticsOne = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'skils_statistics', JSON.stringify(skills)]);

                statisticsOne.stdout.on('data', (data) => {
                    console.log(`Python output: ${data}`);
                });

                statisticsOne.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });

                statisticsOne.on('close', (code) => {
                    console.log(`Python process exited with code ${code}`);
                });
        })
    }
}
