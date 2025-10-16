import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';

@Module({
    imports: [],
    controllers: [InterviewController],
    providers: [InterviewService],
})

export class InterviewModule { }