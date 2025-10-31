import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Interview } from './interview.entity'
import { interviewStatusType, interviewType } from 'src/types'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { Employee } from 'src/EmployeeModule/employee.entity'
import ApiError from 'src/apiError'
import { CompanyService } from 'src/CompanyModule/company.service'

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,

    private employeeService: EmployeeService,
    private companyService: CompanyService,
  ) {}

  async addInterview(
    interviewSubject: Employee,
    interviewDate: Date,
    interviewType: interviewType,
    interviewDesc: string,
    employeeId: number,
  ): Promise<Interview> {
    try {
      const employee = await this.employeeService.getEmployee(employeeId)

      const interview = new Interview({
        interview_date: interviewDate,
        interview_type: interviewType,
        interview_subject: interviewSubject,
        interview_owner: employee,
        company: employee.company,
        interview_desc: interviewDesc,
      })

      const interviewData = await this.interviewRepository.save(interview)

      return interviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async finishInterview(
    interviewId: number,
    interviewDuration: number,
    interviewComment: string,
  ): Promise<Interview> {
    try {
      const interview = await this.interviewRepository.findOne({
        where: {
          interview_id: interviewId,
        },
      })

      if (!interview) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Интервью не найдено!')
      }

      interview.interview_status = interviewStatusType.COMPLETED
      interview.interview_duration = interviewDuration
      interview.interview_comment = interviewComment

      const interviewData = await this.interviewRepository.save(interview)

      return interviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async cancelInterview(interviewId: number): Promise<Interview> {
    try {
      const interview = await this.interviewRepository.findOne({
        where: {
          interview_id: interviewId,
        },
      })

      if (!interview) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Интервью не найдено!')
      }

      interview.interview_status = interviewStatusType.CANCELED

      const interviewData = await this.interviewRepository.save(interview)

      return interviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getInterviews(companyId: number): Promise<Interview[]> {
    try {
      const company = await this.companyService.getCompanyInfo(companyId)
      const interviews = await this.interviewRepository.find({
        where: {
          company: company,
        },
      })

      if (!interviews) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Интервью не найдено!')
      }

      return interviews
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
