import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socket } from './socket.entity';
import { Request } from './request.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { TokenService } from 'src/EmployeeModule/token.service';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { SocketService } from './socket.service';
import { InterviewService } from 'src/InterviewModule/interview.service';
import { Interview } from 'src/InterviewModule/interview.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Request, Socket, Employee, Employee_token, Interview])
    ],
    controllers: [],
    providers: [SocketGateway, RequestService, EmployeeService, TokenService, SocketService, InterviewService],
    exports: [SocketGateway]
})

export class SocketGatewayModule { }