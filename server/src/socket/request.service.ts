import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "./socket.entity";
import { Repository } from "typeorm";
import { EmployeeService } from "src/EmployeeModule/employee.service";
import { requestType } from "src/types";
import { Request } from "./request.entity";
import { Employee } from "src/EmployeeModule/employee.entity";
import ApiError from "src/apiError";
import { SkillService } from "src/SkillModule/skill.service";

@Injectable()
export class RequestService {
    constructor(
        @InjectRepository(Socket)
        private socketRepository: Repository<Socket>,

        @InjectRepository(Request)
        private requestRepository: Repository<Request>,

        private employeeService: EmployeeService,
        private skillService: SkillService
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

    async getReceivedRequests(employeeId: number): Promise<Request[]> {
        try {
            const employee = await this.employeeService.getCleanEmployee(employeeId)
    
            const requests = await this.requestRepository.find({
                where: {
                    request_receiver: employee,
                    request_status: 'pending'
                },
                relations: {
                    request_owner: true,
                    request_skill: {
                        skill_shape: true
                    }
                }
            })
    
            return requests
        } catch (error) {
            throw new ApiError(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR, error.message ? error.message : error)
        }
    }

    async getSendedRequests(employeeId: number): Promise<Request[]> {
        try {
            const employee = await this.employeeService.getCleanEmployee(employeeId)
    
            const requests = await this.requestRepository.find({
                where: {
                    request_owner: employee
                },
                relations: {
                    request_receiver: true,
                    request_skill: {
                        skill_shape: true
                    }
                }
            })
    
            return requests
        } catch (error) {
            throw new ApiError(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR, error.message ? error.message : error)
        }
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

    async sendRequest(requestType: requestType, employeeId: number, skill_id): Promise<Request> {
        const employee = await this.employeeService.getEmployee(employeeId)
        const skill = await this.skillService.getSkillById(skill_id)

        const request = new Request({
            request_type: requestType,
            request_owner: employee,
            request_status: 'pending',
            request_skill: skill,
            request_receiver: employee.team.teamlead,
            request_role_receiver: 'teamlead',
        })

        const requestData = await this.requestRepository.save(request)

        return requestData
    }

    async cancelRequest(requestId: number): Promise<Request> {
        const request = await this.requestRepository.findOne({
            where: {
                request_id: requestId
            },
            relations: {
                request_owner: true,
                request_receiver: true
            }
        })

        if (!request) {
            throw new Error('Запрос не найден!')
        }

        request.request_status = 'canceled'

        const requestData = await this.requestRepository.save(request)

        return request
    }

    async completeRequest(requestId: number): Promise<Request> {
        const request = await this.requestRepository.findOne({
            where: {
                request_id: requestId
            },
            relations: {
                request_owner: true
            }
        })

        if (!request) {
            throw new Error('Запрос не найден!')
        }

        request.request_status = 'completed'

        const requestData = await this.requestRepository.save(request)

        return request
    }
}