import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';
import { interviewType } from 'src/types';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Employee } from 'src/EmployeeModule/employee.entity';

@Injectable()
export class InterviewService {
    constructor(
        @InjectRepository(Interview)
        private interviewRepository: Repository<Interview>,

        private employeeService: EmployeeService
    ) {}

    async addInterview(interviewSubject: Employee, interviewDate: Date, interviewType: interviewType, interviewDesc: string, employeeId: number): Promise<Interview> {
        const employee = await this.employeeService.getEmployee(employeeId)

        const interview = new Interview({
            interview_date: interviewDate,
            interview_type: interviewType,
            interview_subject: interviewSubject,
            interview_owner: employee,
            company: employee.company,
            interview_desc: interviewDesc
        })

        const interviewData = await this.interviewRepository.save(interview)

        return interviewData
    }

    async finishInterview(interviewId: number, interviewDuration: number, interviewComment: string): Promise<Interview> {
        const interview = await this.interviewRepository.findOne({
            where: {
                interview_id: interviewId
            }
        })

        if (!interview) {
            throw new Error('Интервью не найдено!')
        }

        interview.interview_status = 'completed'
        interview.interview_duration = interviewDuration
        interview.interview_comment = interviewComment

        const interviewData = await this.interviewRepository.save(interview)

        return interviewData
    }

    async cancelInterview(interviewId: number): Promise<Interview> {
        const interview = await this.interviewRepository.findOne({
            where: {
                interview_id: interviewId
            }
        })

        if (!interview) {
            throw new Error('Интервью не найдено!')
        }

        interview.interview_status = 'canceled'

        const interviewData = await this.interviewRepository.save(interview)

        return interviewData
    }
}
