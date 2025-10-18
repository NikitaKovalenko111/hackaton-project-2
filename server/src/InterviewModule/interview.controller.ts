import { Controller, Get } from '@nestjs/common';
import { InterviewService } from './interview.service';

@Controller()
export class InterviewController {
    constructor(private readonly employeeService: InterviewService) { }
}