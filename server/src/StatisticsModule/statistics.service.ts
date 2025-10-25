import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ApiError from 'src/apiError';
import { Statistics } from './statistics.entity';
import { spawn } from 'child_process';
import { CompanyService } from 'src/CompanyModule/company.service';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Statistics)
        private statisticsRepository: Repository<Statistics>,

        private readonly companyService: CompanyService
    ) {}

    async generate(companyId: number) {
        const skills = await this.companyService.getSkills(companyId)

        console.log(skills);

        const promise = new Promise((resolve, reject) => {
            const statisticsOne = spawn('python', ['statistics.py', 'skils_statistics', ]);
        })
    }
}
