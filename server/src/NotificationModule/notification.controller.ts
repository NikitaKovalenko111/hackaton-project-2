import { Body, Controller, Get, HttpException, Post, Req } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
import { applyNotificationBodyDto } from "./notification.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Notifications")
@ApiBearerAuth()    
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  @Get("/get/notApplied")
  @ApiOperation({ summary: "Получить все неприменённые уведомления" })
  @ApiOkResponse({ type: [Notification], description: "Список уведомлений" })
  async getNotAppliedNotifications(@Req() request: Request): Promise<Notification[]> {
    try {
      const employeeId = (request as any).employee.employee_id
  
      const notifications = await this.notificationService.getNotAppliedNotifications(employeeId)
  
      return notifications
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get("/get/applied")
  @ApiOperation({ summary: "Получить все применённые уведомления" })
  @ApiOkResponse({ type: [Notification], description: "Список уведомлений" })
  async getAppliedNotifications(@Req() request: Request): Promise<Notification[]> {
    try {
      const employeeId = (request as any).employee.employee_id
  
      const notifications = await this.notificationService.getAppliedNotifications(employeeId)
  
      return notifications
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get("/get/all")
  @ApiOperation({ summary: "Получить все уведомления сотрудника" })
  @ApiOkResponse({ type: [Notification], description: "Список уведомлений" })
  async getAllNotifications(@Req() request: Request): Promise<Notification[]> {
    try {
      const employeeId = (request as any).employee.employee_id
  
      const notifications = await this.notificationService.getAllNotifications(employeeId)
  
      return notifications
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post("/apply/one")
  @ApiOperation({ summary: "Отметить одно уведомление как применённое" })
  @ApiBody({ type: applyNotificationBodyDto })
  @ApiOkResponse({ type: Notification, description: "Обновлённое уведомление" })
  @ApiNotFoundResponse({ description: "Уведомление не найдено" })
  async applyNotification(@Body() applyNotificationBody: applyNotificationBodyDto): Promise<Notification> {
    try {
      const { notification_id } = applyNotificationBody

      const notification = await this.notificationService.applyOneNotification(notification_id)

      return notification
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post("/apply/all")
  @ApiOperation({ summary: "Применить все уведомления сотрудника" })
  @ApiOkResponse({ type: [Notification], description: "Список обновлённых уведомлений" })
  async applyAllNotification(@Req() req: Request): Promise<Notification[]> {
    try {
      const employeeId = (req as any).employee.employee_id

      const notifications = await this.notificationService.applyAllNotifications(employeeId)

      return notifications
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
