import { SocketGateway } from 'src/socket/socket.gateway'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { RoleType } from 'src/types'

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post('/add/question')
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

  @Delete('/remove/question/:id')
  async removeQuestion(@Param('id') questionId: number): Promise<Question> {
    try {
      const question = await this.reviewService.removeQuestion(questionId)

      return question
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/questions')
  async getReviewQuestions(@Req() req: Request): Promise<Question[]> {
    try {
      const employeeId = (req as any).employee.employee_id

      const company = (await this.employeeService.getEmployee(employeeId)).company

      if (!company) {
        throw new HttpException('Компания не найдена!', HttpStatus.NOT_FOUND)
      }

      const review = await this.reviewService.getReviewByCompany(company.company_id)

      const questions = await this.reviewService.getReviewQuestions(review.review_id)

      return questions
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
      ).filter(employee => employee.role?.role_name != RoleType.HR).length

      if (ids == employeesCount) {
        this.socketGateway.server.to(`company/${company_id}`).emit('endedPerfomanceReview')
        const reviewData = await this.reviewService.endReview(review_id)
      }

      return answersData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/start')
  async startReview(
    @Body() startReviewBody: { review_id: number },
  ): Promise<Review> {
    try {
      const { review_id } = startReviewBody

      const reviewData = await this.reviewService.startReview(review_id)

      return reviewData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
