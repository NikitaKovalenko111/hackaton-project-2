import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { clientType, requestType } from 'src/types';
import { RequestService } from './request.service';
import { TokenService } from 'src/EmployeeModule/token.service';
import { SocketService } from './socket.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import ApiError from 'src/apiError';
import { EmployeeService } from 'src/EmployeeModule/employee.service';

interface requestDto {
  requestType: requestType,
  employeeId: number
}

interface cancelRequestDto {
  request_id: number
  employee_id: number
}

interface completeRequestDto {
  request_id: number
}

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly requestGatewayService: RequestService,
    private readonly socketService: SocketService,
    private readonly tokenService: TokenService,
    private readonly employeeService: EmployeeService
  ) { }

  async handleConnection(client: Socket) {
    try {
      const accessToken = client.request.headers.authorization?.split(" ")[1]
      const clientType = client.request.headers.client_type as clientType
      const telegramId = client.request.headers.telegram_id as string

      console.log(client.request.headers);
      console.log(client);

      if (!clientType) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Не указан тип клиента!')
      }
  
      if (!accessToken && clientType == 'web') {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'Вы не авторизованы!')
      }

      let employee

      if (accessToken) {
        employee = await this.tokenService.validateAccessToken(accessToken) as any
      } else if (!accessToken && telegramId && clientType == 'telegram') {
        employee = await this.employeeService.getEmployeeByTgId(parseInt(telegramId))
      }
      
      const data = await this.socketService.saveSocket(client.id, employee.employee_id, clientType)
  
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
    @ConnectedSocket() socket: Socket
  ) {
    try {
      const { requestType, employeeId } = request
  
      const requestData = await this.requestGatewayService.sendRequest(requestType, employeeId)
  
      if (requestData.request_receiver != null) {
        const socketWeb = await this.socketService.getSocketByEmployeeId(requestData.request_receiver)
        const socketTg = await this.socketService.getSocketByEmployeeId(requestData.request_receiver, 'telegram')
  
        if (!socketWeb && !socketTg) {
          return requestData
        }   
  
        if (socketWeb) {
          this.server.to(socketWeb.client_id as string).emit('newRequest', requestData)
        }
        if (socketTg) {
          this.server.to(socketTg.client_id as string).emit('newRequest', requestData)
        }
      }
    }
    catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @SubscribeMessage('cancelRequest')
  async handleCancelRequest(
    @MessageBody() request: cancelRequestDto
  ) {
    try {
      const { request_id, employee_id } = request
  
      const requestData = await this.requestGatewayService.cancelRequest(request_id)
  
      if (requestData.request_receiver != null && employee_id == requestData.request_owner.employee_id) {
        const socketTg = await this.socketService.getSocketByEmployeeId(requestData.request_receiver, 'telegram')
  
        if (!socketTg) {
          return requestData
        } 
  
        this.server.to(socketTg.client_id as string).emit('canceledRequest', requestData)
      } else if (requestData.request_receiver != null && employee_id == requestData.request_receiver.employee_id) {
        const socket = await this.socketService.getSocketByEmployeeId(requestData.request_owner, 'telegram')
  
        if (!socket) {
          return requestData
        }   
  
        this.server.to(socket.client_id as string).emit('canceledRequest', requestData)
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @SubscribeMessage('completeRequest')
  async handleCompleteRequest(
    @MessageBody() request: completeRequestDto
  ) {
    try {
      const { request_id } = request
  
      const requestData = await this.requestGatewayService.completeRequest(request_id)
  
      if (requestData.request_owner != null) {
        const socket = await this.socketService.getSocketByEmployeeId(requestData.request_owner)
  
        if (!socket) {
          return requestData
        }   
  
        this.server.to(socket.client_id as string).emit('completedRequest', requestData)
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
} 
