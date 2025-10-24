import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './interview.entity';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { TokenService } from 'src/EmployeeModule/token.service';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { RequestService } from 'src/socket/request.service';
import { SocketService } from 'src/socket/socket.service';
import { Socket } from 'src/socket/socket.entity';
import { Request } from 'src/socket/request.entity';
import { SocketGatewayModule } from 'src/socket/socket.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Interview, Employee, Employee_token, Socket, Request]),
        SocketGatewayModule,
    ],
    controllers: [InterviewController],
    providers: [InterviewService, EmployeeService, TokenService, RequestService, SocketService],
})

export class InterviewModule { }