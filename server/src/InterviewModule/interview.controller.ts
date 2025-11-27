import { Body, Controller, Get, HttpException, Post, Req } from '@nestjs/common'
import { InterviewService } from './interview.service'
import { Interview } from './interview.entity'
import { SocketGateway } from 'src/socket/socket.gateway'
import { SocketService } from 'src/socket/socket.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import {
  addInterviewBodyDto,
  addInterviewByEmailBodyDto,
  cancelInterviewBodyDto,
  finishInterviewBodyDto,
} from './interview.dto'
import { notificationType } from 'src/types'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { NotificationService } from 'src/NotificationModule/notification.service'

@ApiTags('Interview')
@Controller('interview')
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly notificationService: NotificationService,
    private readonly employeeService: EmployeeService,
  ) {}

  @ApiOperation({ summary: 'Создать интервью по email сотрудника' })
  @ApiBody({ type: addInterviewByEmailBodyDto })
  @ApiOkResponse({
  description: 'Интервью успешно создано',
  type: Interview,
})
  @ApiBadRequestResponse({ description: 'Некорректные данные запроса' })
  @ApiNotFoundResponse({ description: 'Сотрудник с указанным email не найден' })
  @Post('/add/byEmail')
  async addInterviewByEmail(
    @Body() addInterviewByEmailBody: addInterviewByEmailBodyDto,
    @Req() req: Request,
  ) {
    try {
      const employeeId = (req as any).employee.employee_id
      const {
        interview_subject,
        interview_date,
        interview_type,
        interview_desc,
      } = addInterviewByEmailBody
      const interviewSubjectData =
        await this.employeeService.getEmployeeByEmail(interview_subject)

      const interviewData = await this.interviewService.addInterview(
        interviewSubjectData,
        interview_date,
        interview_type,
        interview_desc,
        employeeId,
      )

      await this.notificationService.sendNotification(interviewData.interview_subject.employee_id, notificationType.NEW_INTERVIEW, interviewData, interviewData.interview_id)

      return interviewData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/add')
  @ApiOperation({ summary: 'Создать новое интервью для сотрудника' })
  @ApiBody({ type: addInterviewBodyDto })
  @ApiResponse({ status: 201, type: Interview, description: 'Созданное интервью' })
  async addInterview(
    @Body() addInterviewBody: addInterviewBodyDto,
    @Req() req: Request,
  ): Promise<Interview> {
    try {
      const employeeId = (req as any).employee.employee_id
      const {
        interview_subject,
        interview_date,
        interview_type,
        interview_desc,
      } = addInterviewBody
      const interviewSubjectData =
        await this.employeeService.getCleanEmployee(interview_subject)

      const interviewData = await this.interviewService.addInterview(
        interviewSubjectData,
        interview_date,
        interview_type,
        interview_desc,
        employeeId,
      )

      await this.notificationService.sendNotification(interviewData.interview_subject.employee_id, notificationType.NEW_INTERVIEW, interviewData, interviewData.interview_id)

      return interviewData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/get')
  @ApiOperation({ summary: 'Получить список запланированных интервью текущего сотрудника' })
  @ApiResponse({ status: 200, type: [Interview], description: 'Список интервью' })
  async getPlannedInterviews(@Req() req: Request): Promise<Interview[]> {
    try {
      const employeeId = (req as any).employee.employee_id

      const interviews = await this.interviewService.getPlannedInterviews(employeeId)

      return interviews
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/cancel')
  @ApiOperation({ summary: 'Отменить интервью по ID' })
  @ApiBody({ type: cancelInterviewBodyDto })
  @ApiResponse({ status: 200, type: Interview, description: 'Отменённое интервью' })
  async cancelInterview(
    @Body() cancelInterviewBody: cancelInterviewBodyDto,
  ): Promise<Interview> {
    try {
      const { interview_id } = cancelInterviewBody

      const interviewData =
        await this.interviewService.cancelInterview(interview_id)

      return interviewData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/finish')
  @ApiOperation({ summary: 'Завершить интервью' })
  @ApiBody({ type: finishInterviewBodyDto })
  @ApiResponse({ status: 200, type: Interview, description: 'Завершённое интервью' })
  async finishInterview(
    @Body() finishInterviewBody: finishInterviewBodyDto,
  ): Promise<Interview> {
    try {
      const { interview_comment, interview_duration, interview_id } =
        finishInterviewBody

      const interviewData = await this.interviewService.finishInterview(
        interview_id,
        interview_duration,
        interview_comment,
      )

      return interviewData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
