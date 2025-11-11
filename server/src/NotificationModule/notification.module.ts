import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
import { SocketGatewayModule } from "src/socket/socket.module";
import { EmployeeModule } from "src/EmployeeModule/employee.module";

@Module({
  imports: [
    EmployeeModule,
    forwardRef(() => SocketGatewayModule),
    TypeOrmModule.forFeature([
      Notification,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
