import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socket } from './socket.entity';
import { Request } from './request.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { SocketService } from './socket.service';
import { Interview } from 'src/InterviewModule/interview.entity';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';

@Module({
    imports: [
        EmployeeModule,
        TypeOrmModule.forFeature([Request, Socket, Employee, Employee_token, Interview])
    ],
    controllers: [],
    providers: [SocketGateway, RequestService, SocketService],
    exports: [SocketGateway, RequestService, SocketService]
})

export class SocketGatewayModule { }