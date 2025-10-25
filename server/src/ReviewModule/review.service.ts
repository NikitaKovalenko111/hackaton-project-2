import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { sendedAnswer } from './review.controller';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(Question)
        private questionRepository: Repository<Question>,

        private readonly re
    ) {}

    async addQuestion(questionText: string, reviewId: number): Promise<Question> {
        const review = await this.reviewRepository.findOne({
            where: {
                review_id: reviewId
            }
        })

        if (!review) {
            throw new Error('Ревью не найдено!')
        }

        const question = new Question({
            question_text: questionText,
            review: review
        })

        const questionData = await this.questionRepository.save(question)

        return questionData
    }

    async removeQuestion(questionId: number): Promise<Question> {
        const question = await this.questionRepository.delete({
            question_id: questionId
        })

        return question.raw
    }

    async setReview(reviewId: number, reviewInterval: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: {
                review_id: reviewId
            }
        })

        if (!review) {
            throw new Error('Ревью не найдено!')
        }

        review.review_interval = reviewInterval

        const reviewData = await this.reviewRepository.save(review)

        return reviewData
    }

    async startReview(reviewId: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: {
                review_id: reviewId
            }, relations: {
                questions: true,
                company: true
            }
        })

        if (!review) {
            throw new Error('Ревью не найдено!')
        }

        review.review_status = 'active'

        const reviewData = await this.reviewRepository.save(review)

        return reviewData
    }

    async getQuestion(question_id): Promise<Question> {
        const question = await this.questionRepository.findOne({
            where: {
                question_id: question_id
            }
        })

        if (!question) {
            throw new Error('Вопрос не найден!')
        }

        return question
    }

    async sendAnswers(answers: sendedAnswer[], employee: Employee): Promise<Answer[]> {
        const answersData: Answer[] = []

        answers.forEach(async (el) => {
            const question = await this.getQuestion(el.question_id)

            const answer = new Answer({
                answer_text: el.answer_text,
                employee: employee,
                question: question
            })

            answersData.push(answer)
        })

        return answersData
    }
}
