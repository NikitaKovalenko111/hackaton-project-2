import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { clientType, notificationType } from 'src/types'
import { RequestService } from './request.service'
import { TokenService } from 'src/EmployeeModule/token.service'
import { SocketService } from './socket.service'
import { HttpException, HttpStatus } from '@nestjs/common'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import type {
  cancelRequestDto,
  completeRequestDto,
  requestDto,
} from './request-socket.dto'

import dotenv from "dotenv"
import { NotificationService } from 'src/NotificationModule/notification.service'

dotenv.config()

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 30000,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly requestGatewayService: RequestService,
    private readonly socketService: SocketService,
    private readonly tokenService: TokenService,
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationService
  ) {}

  async handleConnection(client: Socket) {
    try {  
      const accessToken = client.request.headers.authorization?.split(' ')[1]
      const client_type = client.request.headers.client_type as clientType
      const telegramId = client.request.headers.telegram_id as string

      console.log(client_type);

      if (!client_type) {
        throw new HttpException('Не указан тип клиента!', HttpStatus.BAD_REQUEST)
      }

      if (!accessToken && client_type == clientType.WEB) {
        throw new HttpException('Вы не авторизованы!', HttpStatus.UNAUTHORIZED)
      }

      let employee

      if (accessToken) {
        employee = (await this.tokenService.validateAccessToken(
          accessToken,
        )) as any
      } else if (!accessToken && telegramId && client_type == clientType.TELEGRAM) {
        employee = await this.employeeService.getEmployeeByTgId(
          parseInt(telegramId),
        )
      }

      const data = await this.socketService.saveSocket(
        client.id,
        employee.employee_id,
        client_type,
      )

      const employeeData = await this.employeeService.getEmployee(employee.employee_id)

      if (employeeData.company) {
        client.join(`company/${employeeData.company.company_id}`)
      }

      return data
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const status = await this.socketService.removeSocket(client.id)

      if (status == 'deleted') {
        return 'disconnected'
      } else {
        return 'error'
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('addRequest')
  async handleSendRequest(
    @MessageBody() request: requestDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { requestType, employeeId, skill_id } = request

      const requestData = await this.requestGatewayService.sendRequest(
        requestType,
        employeeId,
        skill_id,
      )

      if (requestData.request_receiver != null) {
        const notification = await this.notificationService.sendNotification(requestData.request_receiver.employee_id, notificationType.NEW_REQUEST, requestData)

        return {
          notification: notification,
          data: requestData
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @SubscribeMessage('cancelRequest')
  async handleCancelRequest(@MessageBody() request: cancelRequestDto) {
    try {
      const { request_id, employee_id, justification } = request

      const requestData =
        await this.requestGatewayService.cancelRequest(request_id, employee_id, justification)
      
      if (
        requestData.request_receiver &&
        employee_id == requestData.request_owner.employee_id
      ) {
        const notification = await this.notificationService.sendNotification(requestData.request_receiver.employee_id, notificationType.CANCELED_REQUEST, requestData)

        return {
          notification: notification,
          data: requestData
        }
      } else if (
        requestData.request_owner &&
        employee_id == requestData.request_receiver.employee_id
      ) {
        const notification = await this.notificationService.sendNotification(requestData.request_owner.employee_id, notificationType.CANCELED_REQUEST, requestData)

        return {
          notification: notification,
          data: requestData
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @SubscribeMessage('completeRequest')
  async handleCompleteRequest(@MessageBody() request: completeRequestDto) {
    try {
      const { request_id } = request

      const requestData =
        await this.requestGatewayService.completeRequest(request_id)

      if (requestData.request_owner) {
        const notification = await this.notificationService.sendNotification(requestData.request_owner.employee_id, notificationType.COMPLETED_REQUEST, requestData)

        return {
          notification: notification,
          data: requestData
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
