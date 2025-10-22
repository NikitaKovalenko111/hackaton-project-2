import { Module } from '@nestjs/common';
import { RequestGateway } from './request.gateway';

@Module({
    providers: [RequestGateway],
})

export class RequestGatewayModule { }