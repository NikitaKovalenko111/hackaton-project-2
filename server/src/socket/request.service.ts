import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Socket } from './socket.entity'
import { Repository } from 'typeorm'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { requestStatus, requestType, RoleType, skillLevel } from 'src/types'
import { Request } from './request.entity'
import { Employee } from 'src/EmployeeModule/employee.entity'
import ApiError from 'src/apiError'
import { SkillService } from 'src/SkillModule/skill.service'
import { Skill } from 'src/SkillModule/skill.entity'

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Socket)
    private socketRepository: Repository<Socket>,

    @InjectRepository(Request)
    private requestRepository: Repository<Request>,

    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,

    private employeeService: EmployeeService,
    @Inject(forwardRef(() => SkillService))
    private skillService: SkillService,
  ) {}

  async saveSocket(socketId: string, employeeId: number): Promise<Socket> {
    const employee = await this.employeeService.getEmployee(employeeId)

    if (!employee) {
      throw new Error('Пользователь не найден!')
    }

    const socket = new Socket({
      client_id: socketId,
      employee: employee,
    })

    const socketData = await this.socketRepository.save(socket)

    return socketData
  }

  async getReceivedRequests(employeeId: number): Promise<Request[]> {
    try {
      const requests = await this.requestRepository.find({
        where: {
          request_receiver: {
            employee_id: employeeId
          },
          request_status: requestStatus.PENDING
        },
        relations: {
          request_owner: true,
          request_skill: {
            skill_shape: true,
          },
        },
      })

      return requests
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getSendedRequests(employeeId: number): Promise<Request[]> {
    try {
      const requests = await this.requestRepository.find({
        where: {
          request_owner: {
            employee_id: employeeId
          },
        },
        relations: {
          request_receiver: true,
          request_skill: {
            skill_shape: true,
          },
        },
      })

      return requests
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async sendRequest(
    requestType: requestType,
    employeeId: number,
    skill_id,
  ): Promise<Request> {
    const employee = await this.employeeService.getEmployee(employeeId)
    const skill = await this.skillService.getSkillById(skill_id)

    if (employee.team == null) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Пользователь не состоит в команде!')
    }

    const request = new Request({
      request_type: requestType,
      request_owner: employee,
      request_status: requestStatus.PENDING,
      request_skill: skill,
      request_receiver: employee.team.teamlead,
      request_role_receiver: RoleType.TEAMLEAD,
    })

    const requestData = await this.requestRepository.save(request)

    return requestData
  }

  async removeRequestsBySkillShape(skillShapeId: number): Promise<Request[]> {
    const requests = await this.requestRepository.find({
      where: {
        request_skill: {
          skill_shape: {
            skill_shape_id: skillShapeId
          }
        }
      },
      relations: {
        request_skill: {
          skill_shape: true
        }
      }
    })

    const requestsData = await this.requestRepository.remove(requests)

    return requestsData
  }

  async cancelRequest(requestId: number): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: {
        request_id: requestId,
      },
      relations: {
        request_owner: true,
        request_receiver: true,
      },
    })

    if (!request) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Запрос не найден!')
    }

    request.request_status = requestStatus.CANCELED

    await this.requestRepository.save(request)

    return request
  }

  async completeRequest(requestId: number): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: {
        request_id: requestId,
      },
      relations: {
        request_owner: true,
        request_skill: true
      },
    })

    if (!request) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Запрос не найден!')
    }

    const skill = await this.skillService.getSkillById(request.request_skill.skill_connection_id)

    const skillLevels = ['junior', 'junior+', 'middle', 'middle+', 'senior']
    const levelId = skillLevels.indexOf(request.request_skill.skill_level)

    if (levelId != 4) {
      skill.skill_level = skillLevels[levelId+1] as skillLevel
    }

    await this.skillRepository.save(skill)

    request.request_status = requestStatus.COMPLETED

    await this.requestRepository.save(request)

    return request
  }
}
