import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class RequestGateway{
  @SubscribeMessage('request')
  handleRequest(@MessageBody() request: string) {
    console.log(request);
  }
} 
