import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ApiError from 'src/apiError';
import { Statistics } from './statistics.entity';
import { spawn } from 'child_process';
import { CompanyService } from 'src/CompanyModule/company.service';
import { SkillService } from 'src/SkillModule/skill.service';
import { InterviewService } from 'src/InterviewModule/interview.service';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Statistics)
        private statisticsRepository: Repository<Statistics>,

        private readonly skillService: SkillService,
        private readonly companyService: CompanyService,
        private readonly interviewService: InterviewService
    ) {}

    async generate(companyId: number, statisticsName: string[]) {
        const skills = await this.skillService.getSkillsByCompany(companyId)
        const company = await this.companyService.getCompanyInfo(companyId)

        if (statisticsName.includes('skillsByCount')) {
            const current = await this.statisticsRepository.findOne({
                where: {
                    statistics_name: 'skillsByCount'
                }
            })         
            const statisticsOne = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'skils_statistics', JSON.stringify(skills)]);
    
            statisticsOne.stdout.on('data', async (data) => {
                if (current) {
                    current.statistics_data = data
                    const statisticsData = await this.statisticsRepository.save(current)
                } else {
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'skillsByCount',
                        statistics_data: data
                    })

                    const statisticsData = await this.statisticsRepository.save(statistics)
                }
            });
    
            statisticsOne.stderr.on('data', (data) => {
                console.error(`Python error: ${data}`);
            });
        }
    }
}
