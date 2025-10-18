import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './interview.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Interview])
    ],
    controllers: [InterviewController],
    providers: [InterviewService],
})

export class InterviewModule { }