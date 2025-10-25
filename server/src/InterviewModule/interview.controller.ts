import { Body, Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { interviewType } from 'src/types';
import { Interview } from './interview.entity';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketService } from 'src/socket/socket.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';

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
        try {
            const employeeId = (req as any).employee.employee_id
            const { interview_subject, interview_date, interview_type, interview_desc } = addInterviewBody
            const interviewSubjectData = await this.employeeService.getCleanEmployee(interview_subject)
    
            const interviewData = await this.interviewService.addInterview(interviewSubjectData, interview_date, interview_type, interview_desc, employeeId)
    
            const socketWeb = await this.socketService.getSocketByEmployeeId(interviewSubjectData)
            const socketTg = await this.socketService.getSocketByEmployeeId(interviewSubjectData, 'telegram')
    
            if (!socketWeb && !socketTg) {
                return interviewData
            }

            if (socketWeb) {
                this.socketGateway.server.to(socketWeb.client_id).emit('newInterview', interviewData)
            }
            if (socketTg) {
                this.socketGateway.server.to(socketTg.client_id).emit('newInterview', interviewData)
            }
    
            return interviewData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/get/planned')
    async getPlannedInterviews(@Req() req: Request): Promise<Interview[]> {
        try {
            const employeeId = (req as any).employee.employee_id
    
            const employee = await this.employeeService.getEmployee(employeeId)
    
            return employee.plannedInterviews
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/get/created')
    async getCreatedInterviews(@Req() req: Request): Promise<Interview[]> {
        try {
            const employeeId = (req as any).employee.employee_id
    
            const employee = await this.employeeService.getEmployee(employeeId)
    
            return employee.createdInterviews
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/cancel')
    async cancelInterview(@Body() cancelInterviewBody: cancelInterviewBodyDto): Promise<Interview> {
        try {
            const { interview_id } = cancelInterviewBody
    
            const interviewData = await this.interviewService.cancelInterview(interview_id)
    
            return interviewData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/finish')
    async finishInterview(@Body() finishInterviewBody: finishInterviewBodyDto): Promise<Interview> {
        try {
            const { interview_comment, interview_duration, interview_id } = finishInterviewBody
    
            const interviewData = await this.interviewService.finishInterview(interview_id, interview_duration, interview_comment)
    
            return interviewData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}