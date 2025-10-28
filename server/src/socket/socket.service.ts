import { HttpStatus, Injectable } from "@nestjs/common"
import { EmployeeService } from "src/EmployeeModule/employee.service"
import { Socket } from "./socket.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Employee } from "src/EmployeeModule/employee.entity"
import ApiError from "src/apiError"
import { clientType } from "src/types"

@Injectable()
export class SocketService {
    constructor(
        @InjectRepository(Socket)
        private readonly socketRepository: Repository<Socket>,

        private readonly employeeService: EmployeeService
    ) {}
    async saveSocket(socketId: string, employeeId: number, clientType: clientType): Promise<Socket> {
        try {
            console.log(employeeId);
            
            const employee = await this.employeeService.getCleanEmployee(employeeId)
    
            if (!employee) {
                throw new ApiError(HttpStatus.NOT_FOUND, 'Пользователь не найден!')
            }
    
            const socketCurrent = await this.socketRepository.findOne({
                where: {
                    employee: employee,
                    client_type: clientType
                }
            })

            if (socketCurrent) {
                socketCurrent.client_id = socketId

                const socketData = await this.socketRepository.save(socketCurrent)

                return socketData
            }
    
            const socket = new Socket({
                client_id: socketId,
                employee: employee,
                client_type: clientType
            })
    
            const socketData = await this.socketRepository.save(socket)
    
            return socketData
        } catch (error) {
            throw new ApiError(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR, error.message ? error.message : error)
        }
    }

    async removeSocket(socketId: string): Promise<string> {
        try {
            const socket = await this.socketRepository.delete({
                client_id: socketId
            })

            return 'deleted'
        } catch (error) {
            throw new ApiError(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR, error.message ? error.message : error)
        }
    }

    async getSocketByEmployeeId(employee: Employee, clientType: clientType = 'web'): Promise<Socket | null> {
        try {
            const socket = await this.socketRepository.findOne({
                where: {
                    employee: employee,
                    client_type: clientType
                }
            })  
    
            if (!socket) {
                return null
            }
    
            return socket
        } catch (error) {
            throw new ApiError(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR, error.message ? error.message : error)
        }
    }
}