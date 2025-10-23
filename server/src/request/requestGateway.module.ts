import { Module } from '@nestjs/common';
import { RequestGateway } from './request.gateway';
import { RequestGatewayService } from './requestGateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socket } from './socket.entity';
import { Request } from './request.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { TokenService } from 'src/EmployeeModule/token.service';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Request, Socket, Employee, Employee_token])
    ],
    controllers: [],
    providers: [RequestGateway, RequestGatewayService, EmployeeService, TokenService],
})

export class RequestGatewayModule { }