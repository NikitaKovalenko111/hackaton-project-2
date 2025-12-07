import { Injectable } from '@nestjs/common'
import { skillLevel } from 'src/types';
import GigaChat from 'gigachat';
import { SkillService } from 'src/SkillModule/skill.service';
import { aiResponse, aiReview } from './ai.dto';
import { InterviewService } from 'src/InterviewModule/interview.service';
import { RequestService } from 'src/socket/request.service';

@Injectable()
export class AIService {
  constructor(
    private readonly skillService: SkillService,
    private readonly interviewService: InterviewService,
    private readonly requestService: RequestService
  ) {}

  async getReview(employeeId: number): Promise<aiReview> {
    const finishedInterviews = await this.interviewService.getFinishedInterviews(employeeId)
    const cancelledRequests = await this.requestService.getCancelledRequests(employeeId)

    const prompt = `
    Составь краткое ревью о сотруднике компании на основе отзывов тимлидов/hr о его собеседованиях, а также причинах отклонения запросов на повышение уровня компетенций.
    Отзывы о собеседованиях:
    ${
      finishedInterviews.map(i => `${i.interview_comment}\n`)
    }
    Причины отклонения:
    ${
      cancelledRequests.map(r => `${r.justification}\n`)
    }
    `

    const giga = new GigaChat({
        credentials: process.env.GIGACHAT_AUTHORIZATION_KEY,
    })

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
    const response = await giga.chat({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    return {
      message: response.choices[0].message.content as string
    }
  }

  async getPlan(skillShapeId: number, skillLevel: skillLevel): Promise<aiResponse> {
    const skillShape = await this.skillService.getSkillShapeById(skillShapeId)

    const giga = new GigaChat({
        credentials: process.env.GIGACHAT_AUTHORIZATION_KEY,
    })

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
    const response = await giga.chat({
      messages: [
        {
          role: 'user',
          content: `Составь краткий план, как мне поднять свой уровень по компетенции ${skillShape.skill_name}, если мой текущий уровень ${skillLevel}`
        }
      ],
      max_tokens: 500
    })

    return {
      message: response.choices[0].message.content as string,
      skill_shape: skillShape,
      skill_level: skillLevel
    }
  }
}
