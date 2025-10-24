import { Injectable } from "@nestjs/common"
import { EmployeeService } from "src/EmployeeModule/employee.service"
import { Socket } from "./socket.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Employee } from "src/EmployeeModule/employee.entity"

@Injectable()
export class SocketService {
    constructor(
        @InjectRepository(Socket)
        private readonly socketRepository: Repository<Socket>,

        private readonly employeeService: EmployeeService
    ) {}
    async saveSocket(socketId: string, employeeId: number): Promise<Socket> {
        const employee = await this.employeeService.getEmployee(employeeId)

        if (!employee) {
            throw new Error('Пользователь не найден!')
        }

        const socketCurrent = await this.socketRepository.findOne({
            where: {
                employee: employee
            }
        })

        if (socketCurrent) {
            return socketCurrent
        }

        const socket = new Socket({
            client_id: socketId,
            employee: employee
        })

        const socketData = await this.socketRepository.save(socket)

        return socketData
    }

    async removeSocket(socketId: string): Promise<string> {
        const socket = await this.socketRepository.delete({
            client_id: socketId
        })

        if (socket.affected && socket.affected > 0) {
            return 'deleted'
        } else {
            throw new Error('Сокет не найден или не удален!')
        }
    }

    async getSocketByEmployeeId(employee: Employee): Promise<Socket | null> {
        const socket = await this.socketRepository.findOne({
            where: {
                employee: employee
            }
        })  

        if (!socket) {
            return null
        }

        return socket
    }
}