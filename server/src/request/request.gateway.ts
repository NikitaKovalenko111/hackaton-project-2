import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { requestType } from 'src/types';
import { RequestGatewayService } from './requestGateway.service';
import { TokenService } from 'src/EmployeeModule/token.service';

interface requestDto {
  requestType: requestType,
  employeeId: number
}

@WebSocketGateway()
export class RequestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly requestGatewayService: RequestGatewayService,
    private readonly tokenService: TokenService
  ) { }

  async handleConnection(client: Socket) {
    const accessToken = client.request.headers.authorization?.split(" ")[1]

    if (!accessToken) {
      throw new Error('Вы не авторизованы')
    }

    const employee = await this.tokenService.validateAccessToken(accessToken) as any
    
    const data = await this.requestGatewayService.saveSocket(client.id, employee.employee_id)

    return data
  }

  async handleDisconnect(client: Socket) {
    const status = await this.requestGatewayService.removeSocket(client.id)

    if (status == 'deleted') {
      return 'disconnected'
    } else {
      return 'error'
    }
  }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('request')
  async handleSendRequest(
    @MessageBody() request: requestDto,
    @ConnectedSocket() socket: Socket
  ) {
    const { requestType, employeeId } = request

    const requestData = await this.requestGatewayService.sendRequest(requestType, employeeId)

    if (requestData.request_receiver != null) {
      const socket = await this.requestGatewayService.getSocketByEmployeeId(requestData.request_receiver)

      if (!socket) {
        return requestData
      }

      this.server.to(socket.client_id as string).emit('newRequest', requestData)
    }
  }
} 
