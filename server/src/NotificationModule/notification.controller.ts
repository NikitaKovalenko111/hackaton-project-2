import { Body, Controller, Get, HttpException, Post, Req } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
import { applyNotificationBodyDto } from "./notification.dto";

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  @Get("/get/notApplied")
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
