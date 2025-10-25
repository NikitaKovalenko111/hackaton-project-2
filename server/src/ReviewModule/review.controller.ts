import { Body, Controller, Delete, Param, Post, Req} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Question } from './question.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Review } from './review.entity';
import { Answer } from './answer.entity';

interface addQuestionBodyDto {
    question_text: string
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
}

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly employeeService: EmployeeService
    ) { }

    @Post('add/question')
    async addQuestion(@Body() addQuestionBody: addQuestionBodyDto, @Req() req: Request): Promise<Question> {
        const employeeId = (req as any).employee.employee_id
        const { question_text } = addQuestionBody
        const employee = await this.employeeService.getEmployee(employeeId)

        const question = await this.reviewService.addQuestion(question_text, employee.company.company_id)

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
        const { answers, employee_id } = sendAnswersBody
        const employee = await this.employeeService.getCleanEmployee(employee_id)

        const answersData = this.reviewService.sendAnswers(answers, employee)

        return answersData
    }
}