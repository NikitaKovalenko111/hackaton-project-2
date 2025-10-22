import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway(3002)
export class RequestGateway{
  @SubscribeMessage('request')
  handleRequest(@MessageBody() request: string) {
    console.log(request);
  }
} 
