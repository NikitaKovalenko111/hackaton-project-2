import { Module } from '@nestjs/common'
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { SkillModule } from 'src/SkillModule/skill.module';

@Module({
  imports: [
    SkillModule
  ],
  controllers: [AIController],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}