import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Review } from './review.entity'
import { Question } from './question.entity'
import { Answer } from './answer.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { sendedAnswer } from './review.dto'
import ApiError from 'src/apiError'
import { intervalI, reviewStatus } from 'src/types'
import { SocketGateway } from 'src/socket/socket.gateway'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,

    private schedulerRegistry: SchedulerRegistry,

    private readonly socketGateway: SocketGateway,
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

  async setReview(
    reviewId: number,
    reviewInterval: intervalI,
  ): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: {
          review_id: reviewId,
        },
      })

      if (!review) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
      }

      let months = ''

      reviewInterval.months.forEach((m, i) => {
        if (i != reviewInterval.months.length - 1) {
          months += `${m},`
        } else {
          months += `${m}`
        }
      })

      const job = new CronJob(
        `0 0 ${reviewInterval.day} ${months} *`,
        async () => {
          await this.startReview(review.review_id)
        },
      )

      this.schedulerRegistry.addCronJob('startReviewJob', job)

      job.start()

      review.review_interval = `0 0 ${reviewInterval.day} ${months} *`

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
          company: true,
        },
      })

      if (!review) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
      }

      this.socketGateway.server
        .to(`company/${review.company.company_id}`)
        .emit('startedReview', {
          msg: 'review started!',
        })

      review.review_status = reviewStatus.ACTIVE

      const reviewData = await this.reviewRepository.save(review)

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

  async scheduleTesting() {
    console.log('Scheduled')
  }

  async getReviewByCompany(companyId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: {
        company: {
          company_id: companyId,
        },
      },
      relations: {
        company: true,
      },
    })

    if (!review) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Ревью не найдено!')
    }

    return review
  }

  async getReviewQuestions(reviewId: number): Promise<Question[]> {
    const questions = await this.questionRepository.find({
      where: {
        review: {
          review_id: reviewId,
        },
      },
    })

    return questions
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
