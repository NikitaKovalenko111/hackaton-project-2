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
        const statisticsObject: Statistics[] = []

        const promise = new Promise(async (resolve, reject) => {
            if (statisticsName.includes('skillsByCount')) {           
                const statisticsOne = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'skils_statistics', JSON.stringify(skills)]);
    
                statisticsOne.stdout.on('data', async (data) => {
                    console.log(data);
                    
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'skillsByCount',
                        statistics_data: data
                    })
    
                    statisticsObject.push(statistics)
                });
    
                statisticsOne.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });
            }

            if (statisticsName.includes('skillsByLevel')) {
                const statisticsTwo = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'competence_statistics', JSON.stringify(skills)]);
    
                statisticsTwo.stdout.on('data', async (data) => {
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'skillsByLevel',
                        statistics_data: data
                    })
    
                    statisticsObject.push(statistics)
                });
    
                statisticsTwo.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });
            }

            if (statisticsName.includes('interviewsByDate')) {
                const interviews = await this.interviewService.getInterviews(companyId)
                const statisticsTwo = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'interview_months_statistics', JSON.stringify(interviews)]);
    
                statisticsTwo.stdout.on('data', async (data) => {
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'interviewsByDate',
                        statistics_data: data
                    })
    
                    statisticsObject.push(statistics)
                });
    
                statisticsTwo.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });
            }

            if (statisticsName.includes('interviewsByType')) {
                const interviews = await this.interviewService.getInterviews(companyId)
                const statisticsTwo = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'interview_statistics', JSON.stringify(interviews)]);
    
                statisticsTwo.stdout.on('data', async (data) => {
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'interviewsByType',
                        statistics_data: data
                    })
    
                    statisticsObject.push(statistics)
                });
    
                statisticsTwo.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });
            }

            if (statisticsName.includes('interviewsByStatus')) {
                const interviews = await this.interviewService.getInterviews(companyId)
                
                const statisticsTwo = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'interview_completion_statistics', JSON.stringify(interviews)]);
    
                statisticsTwo.stdout.on('data', async (data) => {
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'interviewsByStatus',
                        statistics_data: data
                    })
    
                    statisticsObject.push(statistics)
                });
    
                statisticsTwo.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });
            }

            if (statisticsName.includes('employeeByRoles')) {
                const employees = await this.companyService.getEmployees(companyId)
                const statisticsTwo = spawn('./src/StatisticsModule/.venv/Scripts/python.exe', ['./src/StatisticsModule/statistics.py', 'interview_role_statistics', JSON.stringify(employees.map(el => { role_name: el.employeeRole?.role_name }))]);
    
                statisticsTwo.stdout.on('data', async (data) => {
                    const statistics = new Statistics({
                        company: company,
                        statistics_name: 'employeeByRoles',
                        statistics_data: data
                    })
    
                    statisticsObject.push(statistics)
                });
    
                statisticsTwo.stderr.on('data', (data) => {
                    console.error(`Python error: ${data}`);
                });
            }
        }).then(async (data) => {  
            const statisticsData = await this.statisticsRepository.save(statisticsObject)

            return statisticsData
        })
    }
}
