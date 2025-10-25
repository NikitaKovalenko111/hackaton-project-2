import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './interview.entity';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { Employee_token } from 'src/EmployeeModule/token.entity';
import { Socket } from 'src/socket/socket.entity';
import { Request } from 'src/socket/request.entity';
import { SocketGatewayModule } from 'src/socket/socket.module';
import { EmployeeModule } from 'src/EmployeeModule/employee.module';

@Module({
    imports: [
        EmployeeModule,
        TypeOrmModule.forFeature([Interview, Employee, Employee_token, Socket, Request]),
        SocketGatewayModule,
    ],
    controllers: [InterviewController],
    providers: [InterviewService],
    exports: [InterviewService]
})

export class InterviewModule { }