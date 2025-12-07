import { Module } from '@nestjs/common'
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { SkillModule } from 'src/SkillModule/skill.module';
import { InterviewModule } from 'src/InterviewModule/interview.module';
import { SocketGatewayModule } from 'src/socket/socket.module';

@Module({
  imports: [
    SkillModule,
    InterviewModule,
    SocketGatewayModule
  ],
  controllers: [AIController],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}