import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "./socket.entity";
import { Repository } from "typeorm";
import { EmployeeService } from "src/EmployeeModule/employee.service";

@Injectable()
export class RequestGatewayService {
    constructor(
        @InjectRepository(Socket)
        private socketRepository: Repository<Socket>,

        private employeeService: EmployeeService
    ) {}

    async saveSocket(socketId: string, employeeId: number): Promise<Socket> {
        const employee = await this.employeeService.getEmployee(employeeId)

        if (!employee) {
            throw new Error('Пользователь не найден!')
        }

        const socket = new Socket({
            client_id: socketId,
            employee: employee
        })

        const socketData = await this.socketRepository.save(socket)

        return socketData
    }

    async removeSocket(socketId: number): Promise<string> {
        const socket = await this.socketRepository.delete({
            socket_id: socketId
        })

        if (socket.affected && socket.affected > 0) {
            return 'deleted'
        } else {
            throw new Error('Сокет не найден или не удален!')
        }
    }
}