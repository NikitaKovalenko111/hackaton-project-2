import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class RequestGateway {
  @SubscribeMessage('request')
  handleRequest(client: any, payload: any): string {
    return 'Hello world!';
  }
}
