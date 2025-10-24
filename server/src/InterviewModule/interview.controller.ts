import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { interviewType } from 'src/types';
import { Interview } from './interview.entity';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketService } from 'src/socket/socket.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Repository } from 'typeorm';

export interface addInterviewBodyDto {
    interview_subject: number
    interview_date: Date
    interview_type: interviewType
    interview_desc: string
}

interface finishInterviewBodyDto {
    interview_id: number
    interview_comment: string
    interview_duration: number
}

interface cancelInterviewBodyDto {
    interview_id: number
}

@Controller('interview')
export class InterviewController {
    constructor(
        private readonly socketGateway: SocketGateway,

        private readonly interviewService: InterviewService,
        private readonly socketService: SocketService,
        private readonly employeeService: EmployeeService,
    ) { }

    @Post('/add')
    async addInterview(@Body() addInterviewBody: addInterviewBodyDto, @Req() req: Request): Promise<Interview> {
        const employeeId = (req as any).employee.employee_id
        const { interview_subject, interview_date, interview_type, interview_desc } = addInterviewBody
        const interviewSubjectData = await this.employeeService.getCleanEmployee(interview_subject)

        const interviewData = await this.interviewService.addInterview(interviewSubjectData, interview_date, interview_type, interview_desc, employeeId)

        const socket = await this.socketService.getSocketByEmployeeId(interviewSubjectData)

        if (!socket) {
            return interviewData
        }

        this.socketGateway.server.to(socket.client_id).emit('newInterview', interviewData)

        return interviewData
    }

    @Get('/get/planned')
    async getPlannedInterviews(@Req() req: Request): Promise<Interview[]> {
        const employeeId = (req as any).employee.employee_id

        const employee = await this.employeeService.getEmployee(employeeId)

        return employee.plannedInterviews
    }

    @Get('/get/created')
    async getCreatedInterviews(@Req() req: Request): Promise<Interview[]> {
        const employeeId = (req as any).employee.employee_id

        const employee = await this.employeeService.getEmployee(employeeId)

        return employee.createdInterviews
    }

    @Post('/cancel')
    async cancelInterview(@Body() cancelInterviewBody: cancelInterviewBodyDto): Promise<Interview> {
        const { interview_id } = cancelInterviewBody

        const interviewData = await this.interviewService.cancelInterview(interview_id)

        return interviewData
    }

    @Post('/finish')
    async finishInterview(@Body() finishInterviewBody: finishInterviewBodyDto): Promise<Interview> {
        const { interview_comment, interview_duration, interview_id } = finishInterviewBody

        const interviewData = await this.interviewService.finishInterview(interview_id, interview_duration, interview_comment)

        return interviewData
    }
}