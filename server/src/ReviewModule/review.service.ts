import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Review } from './review.entity'
import { Question } from './question.entity'
import { Answer } from './answer.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { sendedAnswer } from './review.dto'
import { SocketGateway } from 'src/socket/socket.gateway'
import { CompanyService } from 'src/CompanyModule/company.service'
import { SocketService } from 'src/socket/socket.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import ApiError from 'src/apiError'
import { reviewStatus } from 'src/types'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,

    private readonly socketGateway: SocketGateway,
    private readonly companyService: CompanyService,
    private readonly socketService: SocketService,
    private readonly employeeService: EmployeeService,
  ) {}

  async addQuestion(questionText: string, reviewId: number): Promise<Question> {
    try {
      const review = await this.reviewRepository.findOne({
        where: {
          review_id: reviewId,
        },
      })

      if (!review) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
      }

      const question = new Question({
        question_text: questionText,
        review: review,
      })

      const questionData = await this.questionRepository.save(question)

      return questionData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async removeQuestion(questionId: number): Promise<Question> {
    try {
      const question = await this.questionRepository.delete({
        question_id: questionId,
      })

      return question.raw
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async setReview(reviewId: number, reviewInterval: number): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: {
          review_id: reviewId,
        },
      })

      if (!review) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
      }

      review.review_interval = reviewInterval

      const reviewData = await this.reviewRepository.save(review)

      return reviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async startReview(reviewId: number): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: {
          review_id: reviewId,
        },
        relations: {
          questions: true,
          company: true,
        },
      })

      if (!review) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
      }

      review.review_status = reviewStatus.ACTIVE

      const reviewData = await this.reviewRepository.save(review)

      const companyEmployees = await this.companyService.getEmployees(
        review.company.company_id,
      )

      companyEmployees.forEach(async (employee) => {
        const workedWith = employee.team?.employees.filter(
          (el) => el.employee_id != employee.employee_id,
        )
        const employeeClean = await this.employeeService.getCleanEmployee(
          employee.employee_id,
        )

        const socket =
          await this.socketService.getSocketByEmployeeId(employeeClean)

        if (socket) {
          this.socketGateway.server
            .to(socket.client_id)
            .emit('startedPerfomanceReview', workedWith)
        }
      })

      return reviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async endReview(review_id: number): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: {
          review_id: review_id,
        },
      })

      if (!review) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
      }

      review.review_status = reviewStatus.PENDING

      const reviewData = await this.reviewRepository.save(review)

      return reviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getQuestion(question_id): Promise<Question> {
    try {
      const question = await this.questionRepository.findOne({
        where: {
          question_id: question_id,
        },
      })

      if (!question) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Вопрос не найден!')
      }

      return question
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async sendAnswers(
    answers: sendedAnswer[],
    employee: Employee,
    employeeSubject: Employee,
  ): Promise<Answer[]> {
    try {
      const answersData: Answer[] = []

      for (const el of answers) {
        const question = await this.getQuestion(el.question_id)

        const answer = new Answer({
          answer_text: el.answer_text,
          employee: employee,
          question: question,
          employee_answer_to: employeeSubject,
        })

        answersData.push(answer)
      }

      const answersResult = await this.answerRepository.save(answersData)

      return answersResult
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getAnswersEmployeesId(companyId: number): Promise<number[]> {
    try {
      const answers = await this.answerRepository.find({
        where: {
          employee: {
            company: {
              company_id: companyId,
            },
          },
        },
        select: {
          employee: true,
        },
        relations: {
          employee: true,
        },
      })

      const ids = answers.map((el) => el.employee.employee_id)

      return ids
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
