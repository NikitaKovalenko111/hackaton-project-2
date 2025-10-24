import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { requestType } from 'src/types';
import { RequestService } from './request.service';
import { TokenService } from 'src/EmployeeModule/token.service';
import { SocketService } from './socket.service';

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

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly requestGatewayService: RequestService,
    private readonly socketService: SocketService,
    private readonly tokenService: TokenService,
  ) { }

  async handleConnection(client: Socket) {
    const accessToken = client.request.headers.authorization?.split(" ")[1]

    if (!accessToken) {
      throw new Error('Вы не авторизованы')
    }

    const employee = await this.tokenService.validateAccessToken(accessToken) as any
    
    const data = await this.socketService.saveSocket(client.id, employee.employee_id)

    return data
  }

  async handleDisconnect(client: Socket) {
    const status = await this.socketService.removeSocket(client.id)

    if (status == 'deleted') {
      return 'disconnected'
    } else {
      return 'error'
    }
  }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('addRequest')
  async handleSendRequest(
    @MessageBody() request: requestDto,
    @ConnectedSocket() socket: Socket
  ) {
    const { requestType, employeeId } = request

    const requestData = await this.requestGatewayService.sendRequest(requestType, employeeId)

    if (requestData.request_receiver != null) {
      const socket = await this.socketService.getSocketByEmployeeId(requestData.request_receiver)

      if (!socket) {
        return requestData
      }   

      this.server.to(socket.client_id as string).emit('newRequest', requestData)
    }
  }

  @SubscribeMessage('cancelRequest')
  async handleCancelRequest(
    @MessageBody() request: cancelRequestDto
  ) {
    const { request_id, employee_id } = request

    const requestData = await this.requestGatewayService.cancelRequest(request_id)

    if (requestData.request_receiver != null && employee_id == requestData.request_owner.employee_id) {
      const socket = await this.socketService.getSocketByEmployeeId(requestData.request_receiver)

      if (!socket) {
        return requestData
      }   

      this.server.to(socket.client_id as string).emit('canceledRequest', requestData)
    } else if (requestData.request_receiver != null && employee_id == requestData.request_receiver.employee_id) {
      const socket = await this.socketService.getSocketByEmployeeId(requestData.request_owner)

      if (!socket) {
        return requestData
      }   

      this.server.to(socket.client_id as string).emit('canceledRequest', requestData)
    }
  }

  @SubscribeMessage('completeRequest')
  async handleCompleteRequest(
    @MessageBody() request: completeRequestDto
  ) {
    const { request_id } = request

    const requestData = await this.requestGatewayService.completeRequest(request_id)

    if (requestData.request_owner != null) {
      const socket = await this.socketService.getSocketByEmployeeId(requestData.request_owner)

      if (!socket) {
        return requestData
      }   

      this.server.to(socket.client_id as string).emit('completedRequest', requestData)
    }
  }
} 
