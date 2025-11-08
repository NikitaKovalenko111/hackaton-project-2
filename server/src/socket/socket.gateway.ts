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
import { clientType, RoleType } from 'src/types'
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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
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
  ) {}

  async handleConnection(client: Socket) {
    try {  
      const accessToken = client.request.headers.authorization?.split(' ')[1]
      const client_type = client.request.headers.client_type as clientType
      const telegramId = client.request.headers.telegram_id as string

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
        const socketWeb = await this.socketService.getSocketByEmployeeId(
          requestData.request_receiver.employee_id,
        )
        const socketTg = await this.socketService.getSocketByEmployeeId(
          requestData.request_receiver.employee_id,
          clientType.TELEGRAM,
        )

        if (!socketWeb && !socketTg) {
          return requestData
        }

        if (socketWeb) {
          this.server
            .to(socketWeb.client_id as string)
            .emit('newRequest', requestData, (err, response) => {
              console.log(err)

              console.log(response)
            })
        }
        if (socketTg) {
          this.server
            .to(socketTg.client_id as string)
            .emit('newRequest', requestData)
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @SubscribeMessage('cancelRequest')
  async handleCancelRequest(@MessageBody() request: cancelRequestDto) {
    try {
      const { request_id, employee_id } = request

      const requestData =
        await this.requestGatewayService.cancelRequest(request_id)
      
      if (
        requestData.request_receiver &&
        employee_id == requestData.request_owner.employee_id
      ) {
        const socketTg = await this.socketService.getSocketByEmployeeId(
          requestData.request_receiver.employee_id,
          clientType.TELEGRAM,
        )
        const socket = await this.socketService.getSocketByEmployeeId(
          requestData.request_receiver.employee_id
        )

        if (socket) {
          this.server
          .to(socket.client_id as string)
          .emit('canceledRequest', requestData)
        }

        if (socketTg) {
          this.server
          .to(socketTg.client_id as string)
          .emit('canceledRequest', requestData)
        }

        return requestData
      } else if (
        requestData.request_owner &&
        employee_id == requestData.request_receiver.employee_id
      ) {
        const socket = await this.socketService.getSocketByEmployeeId(
          requestData.request_owner.employee_id
        )
        const socketTg = await this.socketService.getSocketByEmployeeId(
          requestData.request_owner.employee_id,
          clientType.TELEGRAM,
        )

        if (socket) {
          this.server
          .to(socket.client_id as string)
          .emit('canceledRequest', requestData)
        }

        if (socketTg) {
          this.server
          .to(socketTg.client_id as string)
          .emit('canceledRequest', requestData)
        }

        return requestData
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
        const socket = await this.socketService.getSocketByEmployeeId(requestData.request_owner.employee_id)
        const socketTg = await this.socketService.getSocketByEmployeeId(requestData.request_owner.employee_id, clientType.TELEGRAM)

        if (socket) {
          this.server
          .to(socket.client_id as string)
          .emit('completedRequest', requestData)
        }

        if (socketTg) {
          this.server
          .to(socketTg.client_id as string)
          .emit('completedRequest', requestData)
        }

        return requestData
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
