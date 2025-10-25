import { SocketGateway } from 'src/socket/socket.gateway';
import { Body, Controller, Delete, Param, Post, Req} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Question } from './question.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Review } from './review.entity';
import { Answer } from './answer.entity';
import { CompanyService } from 'src/CompanyModule/company.service';

interface addQuestionBodyDto {
    question_text: string
    review_id: number
}

interface setReviewBodyDto {
    review_id: number
    review_interval: number
}

export interface sendedAnswer {
    answer_text: string
    question_id: number
}

interface sendAnswersBodyDto {
    answers: sendedAnswer[]
    employee_id: number
    employee_answers_to_id: number
    company_id: number
    review_id: number
}

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly employeeService: EmployeeService,
        private readonly companyService: CompanyService,
        private readonly socketGateway: SocketGateway
    ) { }

    @Post('add/question')
    async addQuestion(@Body() addQuestionBody: addQuestionBodyDto, @Req() req: Request): Promise<Question> {
        const { question_text, review_id } = addQuestionBody

        const question = await this.reviewService.addQuestion(question_text, review_id)

        return question
    }

    @Post('/set')
    async setReview(@Body() setReviewBody: setReviewBodyDto, @Req() req: Request): Promise<Review> {
        const { review_id, review_interval } = setReviewBody

        const review = await this.reviewService.setReview(review_id, review_interval)

        return review
    }

    @Delete('remove/question/:id')
    async removeQuestion(@Param('id') questionId: number): Promise<Question> {
        const question = await this.reviewService.removeQuestion(questionId)

        return question
    }

    @Post('/send/answers')
    async sendAnswers(@Body() sendAnswersBody: sendAnswersBodyDto): Promise<Answer[]> {
        const { answers, employee_id, employee_answers_to_id, company_id, review_id } = sendAnswersBody

        const employee = await this.employeeService.getCleanEmployee(employee_id)
        const employeeSubject = await this.employeeService.getCleanEmployee(employee_answers_to_id)

        const answersData = await this.reviewService.sendAnswers(answers, employee, employeeSubject)

        const ids = (new Set(await this.reviewService.getAnswersEmployeesId(company_id))).values.length
        const employeesCount = (await this.companyService.getEmployees(company_id)).length

        if (ids == employeesCount) {
            this.socketGateway.server.emit('endedPerfomanceReview')
            const reviewData = await this.reviewService.endReview(review_id)
        }

        return answersData
    }

    @Post('start')
    async startReview(@Body() startReviewBody: { review_id: number }): Promise<Review> {
        const review = await this.reviewService.startReview(startReviewBody.review_id)

        return review
    }
}