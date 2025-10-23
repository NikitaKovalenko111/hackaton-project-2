import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { requestType } from 'src/types';
import { RequestGatewayService } from './requestGateway.service';

interface requestDto {
  requestType: requestType,
  employeeId: number
}

@WebSocketGateway()
export class RequestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly requestGatewayService: RequestGatewayService
  ) { }

  async handleConnection(client: Socket) {
    const accessToken = client.request.headers.authorization?.split(" ")[1]

    console.log(accessToken);
    
    //const data = await this.requestGatewayService.saveSocket(client.id, employee_id)

    return accessToken
  }

  async handleDisconnect(client: Socket) {
    const status = await this.requestGatewayService.removeSocket(parseInt(client.id))

    if (status == 'deleted') {
      return 'disconnected'
    } else {
      return 'error'
    }
  }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('sendRequest')
  handleSendRequest(
    @MessageBody() request: requestDto,
    @ConnectedSocket() socket: Socket
  ) {
    
  }

  @SubscribeMessage('getRequest')
  handleGetRequest() {

  }
} 
