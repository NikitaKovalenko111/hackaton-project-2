import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Notification } from './notification.entity'
import { Repository } from 'typeorm'
import ApiError from 'src/apiError'
import { clientType, notificationStatusType, notificationType } from 'src/types'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { SocketService } from 'src/socket/socket.service'
import { SocketGateway } from 'src/socket/socket.gateway'
import { InterviewService } from 'src/InterviewModule/interview.service'
import { RequestService } from 'src/socket/request.service'
import { notificationDataDto } from './notification.dto'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    private readonly employeeService: EmployeeService,
    private readonly interviewService: InterviewService,
    private readonly requestService: RequestService,

    @Inject(forwardRef(() => SocketService))
    private readonly socketService: SocketService,

    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
  ) {}

  async getNotAppliedNotifications(
    employeeId: number,
  ): Promise<notificationDataDto[]> {
    try {
      const notificationsData = await this.notificationRepository.find({
        where: {
          receiver: {
            employee_id: employeeId,
          },
          notification_status: notificationStatusType.NOT_APPLIED,
        },
        relations: {
          receiver: true,
        },
      })

      const notifications: Array<notificationDataDto> = []

      for (const el of notificationsData) {
        if (
          el.notification_type == notificationType.INTERVIEW_CANCELLED ||
          el.notification_type == notificationType.NEW_INTERVIEW
        ) {
          const object = await this.interviewService.getInterviewById(
            el.object_id,
          )

          notifications.push({
            notification: el,
            object: object,
          })
        } else if (
          el.notification_type == notificationType.CANCELED_REQUEST ||
          el.notification_type == notificationType.COMPLETED_REQUEST ||
          el.notification_type == notificationType.NEW_REQUEST
        ) {
          const object = await this.requestService.getRequestById(el.object_id)

          notifications.push({
            notification: el,
            object: object,
          })
        }
      }

      return notifications
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getAppliedNotifications(employeeId: number): Promise<Notification[]> {
    try {
      const notifications = await this.notificationRepository.find({
        where: {
          receiver: {
            employee_id: employeeId,
          },
          notification_status: notificationStatusType.APPLIED,
        },
        relations: {
          receiver: true,
        },
      })

      return notifications
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async applyOneNotification(notificationId: number): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: {
          notification_id: notificationId,
        },
      })

      if (!notification) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Уведомление не найдено!')
      }

      notification.notification_status = notificationStatusType.APPLIED

      const notificationData =
        await this.notificationRepository.save(notification)

      return notificationData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async applyAllNotifications(employeeId: number): Promise<Notification[]> {
    try {
      const notifications = await this.notificationRepository.find({
        where: {
          receiver: {
            employee_id: employeeId,
          },
          notification_status: notificationStatusType.NOT_APPLIED,
        },
        relations: {
          receiver: true,
        },
      })

      for (const notification of notifications) {
        notification.notification_status = notificationStatusType.APPLIED
      }

      const notificationData =
        await this.notificationRepository.save(notifications)

      return notificationData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getAllNotifications(employeeId: number): Promise<Notification[]> {
    try {
      const notifications = await this.notificationRepository.find({
        where: {
          receiver: {
            employee_id: employeeId,
          },
        },
        relations: {
          receiver: true,
        },
      })

      return notifications
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async sendNotification(
    employeeId: number,
    notificationType: notificationType,
    data: any,
    objectId: number,
  ): Promise<Notification> {
    try {
      const employee = await this.employeeService.getEmployeeById(employeeId)

      const newNotification = new Notification({
        receiver: employee,
        notification_type: notificationType,
        object_id: objectId,
      })

      const notificationData =
        await this.notificationRepository.save(newNotification)

      const socketWeb =
        await this.socketService.getSocketByEmployeeId(employeeId)
      const socketTg = await this.socketService.getSocketByEmployeeId(
        employeeId,
        clientType.TELEGRAM,
      )

      if (!socketWeb && !socketTg) {
        return notificationData
      }

      if (socketWeb) {
        this.socketGateway.server
          .to(socketWeb.client_id)
          .emit(notificationType, data)
      }
      if (socketTg) {
        this.socketGateway.server
          .to(socketTg.client_id)
          .emit(notificationType, data)
      }

      return notificationData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
