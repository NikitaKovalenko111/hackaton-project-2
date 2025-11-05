import { SocketGateway } from 'src/socket/socket.gateway'
import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { Question } from './question.entity'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { Review } from './review.entity'
import { Answer } from './answer.entity'
import { CompanyService } from 'src/CompanyModule/company.service'
import type {
  addQuestionBodyDto,
  sendAnswersBodyDto,
  setReviewBodyDto,
} from './review.dto'

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post('add/question')
  async addQuestion(
    @Body() addQuestionBody: addQuestionBodyDto,
    @Req() req: Request,
  ): Promise<Question> {
    try {
      const { question_text, review_id } = addQuestionBody

      const question = await this.reviewService.addQuestion(
        question_text,
        review_id,
      )

      return question
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/set')
  async setReview(
    @Body() setReviewBody: setReviewBodyDto,
    @Req() req: Request,
  ): Promise<Review> {
    try {
      const { review_id, review_interval } = setReviewBody

      const review = await this.reviewService.setReview(
        review_id,
        review_interval,
      )

      return review
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Delete('remove/question/:id')
  async removeQuestion(@Param('id') questionId: number): Promise<Question> {
    try {
      const question = await this.reviewService.removeQuestion(questionId)

      return question
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/send/answers')
  async sendAnswers(
    @Body() sendAnswersBody: sendAnswersBodyDto,
  ): Promise<Answer[]> {
    try {
      const {
        answers,
        employee_id,
        employee_answers_to_id,
        company_id,
        review_id,
      } = sendAnswersBody

      const employee = await this.employeeService.getCleanEmployee(employee_id)
      const employeeSubject = await this.employeeService.getCleanEmployee(
        employee_answers_to_id,
      )

      const answersData = await this.reviewService.sendAnswers(
        answers,
        employee,
        employeeSubject,
      )

      const ids = new Set(
        await this.reviewService.getAnswersEmployeesId(company_id),
      ).values.length
      const employeesCount = (
        await this.companyService.getEmployees(company_id)
      ).length

      if (ids == employeesCount) {
        this.socketGateway.server.emit('endedPerfomanceReview')
        const reviewData = await this.reviewService.endReview(review_id)
      }

      return answersData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('start')
  async startReview(
    @Body() startReviewBody: { review_id: number },
  ) {
    try {
      
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
