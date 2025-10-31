import { Injectable } from '@nestjs/common'
import { skillLevel } from 'src/types';
import GigaChat from 'gigachat';
import { SkillService } from 'src/SkillModule/skill.service';
import { aiResponse } from './ai.dto';

@Injectable()
export class AIService {
  constructor(
    private readonly skillService: SkillService
  ) {}

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
