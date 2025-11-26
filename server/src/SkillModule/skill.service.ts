import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { SkillShape } from './skillShape.entity'
import { In, Repository } from 'typeorm'
import { Skill } from './skill.entity'
import { Company } from 'src/CompanyModule/company.entity'
import { skillLevel } from 'src/types'
import { employeePayloadDto } from 'src/EmployeeModule/employee.dto'
import ApiError from 'src/apiError'
import { RequestService } from 'src/socket/request.service'
import { skillOrder } from './skill.dto'
import { SkillOrder } from './skillOrder.entity'

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillShape)
    private skillShapeRepository: Repository<SkillShape>,

    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(SkillOrder)
    private skillOrderRepository: Repository<SkillOrder>,

    @Inject(forwardRef(() => RequestService))
    private readonly requestService: RequestService
  ) {}

  async createSkill(
    skillName: string,
    skillDesc: string,
    companyId: number,
  ): Promise<SkillShape> {
    try {
      const company = await this.companyRepository.findOne({
        where: {
          company_id: companyId,
        },
      })
      if (!company) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компания не найдена!')
      }

      const skillDb = await this.skillShapeRepository.findOne({
        where: {
          skill_name: skillName
        }
      })

      if (skillDb) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Компетенция с таким названием уже существует!")
      }

      const skill = new SkillShape({
        skill_name: skillName,
        skill_desc: skillDesc,
        company: company,
      })

      await this.skillShapeRepository.save(skill)

      return skill
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async giveSkill(
    employee: Employee,
    skillShapeId: number,
    skillLevel: skillLevel,
  ) {
    try {
      const skillShape = await this.skillShapeRepository.findOne({
        where: {
          skill_shape_id: skillShapeId,
        },
      })

      if (!skillShape) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          'Компетенции не существует в компании!',
        )
      }

      const skill = new Skill({
        employee: employee,
        skill_shape: skillShape,
        skill_level: skillLevel,
      })

      const skillData = await this.skillRepository.save(skill)

      return skillData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getSkillOrdersByShape(skillShapeName: string, skillLevel?: skillLevel): Promise<SkillOrder[]> {
    const skillOrders = await this.skillOrderRepository.find({
      where: {
        skill_shape: {
          skill_name: skillShapeName
        },
        skill_level: skillLevel
      },
      relations: {
        skill_shape: true
      }
    })

    return skillOrders
  }

  async getSkillOrdersByShapeNames(skillShapeName: string[], skillLevel?: skillLevel): Promise<SkillOrder[]> {
    const skillOrders = await this.skillOrderRepository.find({
      where: {
        skill_shape: {
          skill_name: In(skillShapeName)
        },
        skill_level: skillLevel
      },
      relations: {
        skill_shape: true
      }
    })

    return skillOrders
  }

  async getSkillOrdersByLevel(skillShapeId: number, skillLevel: skillLevel): Promise<SkillOrder[]> {
    const skillOrders = await this.skillOrderRepository.find({
      where: {
        skill_shape: {
          skill_shape_id: skillShapeId
        },
        skill_level: skillLevel
      },
      relations: {
        skill_shape: true
      }
    })

    return skillOrders
  }

  async getSkillById(skill_id: number): Promise<Skill> {
    try {
      const skill = await this.skillRepository.findOne({
        where: {
          skill_connection_id: skill_id,
        },
        relations: {
          skill_shape: true,
        },
      })

      if (!skill) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компетенция не найдена!')
      }

      return skill
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async giveSkillToMany(
    needEmployees: employeePayloadDto[],
    skill_shape_id: number,
    skill_level: skillLevel,
  ) {
    try {
      const skills: Skill[] = []
      const skillShape = await this.skillShapeRepository.findOne({
        where: {
          skill_shape_id: skill_shape_id,
        },
      })

      if (!skillShape) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          'Компетенции не существует в компании!',
        )
      }

      for (const employee of needEmployees) {
        const skill = new Skill({
          employee: employee as Employee,
          skill_shape: skillShape,
          skill_level: skill_level,
        })

        skills.push(skill)
      }

      const skillData = await this.skillRepository.save(skills)

      return skillData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async updateSkillLevel(
    skillId: number,
    skillLevel: skillLevel,
  ): Promise<Skill> {
    try {
      const skill = await this.skillRepository.findOne({
        where: {
          skill_connection_id: skillId,
        },
      })

      if (!skill) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Навык не найден!')
      }

      skill.skill_level = skillLevel

      const skillData = await this.skillRepository.save(skill)

      return skillData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async deleteSkill(skillId: number): Promise<Skill> {
    try {
      const skill = await this.skillRepository.delete({
        skill_connection_id: skillId,
      })

      return skill.raw
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async deleteSkillShape(skillShapeId: number): Promise<SkillShape> {
    try {
      const skillShape = await this.skillShapeRepository.findOne({
        where: {
          skill_shape_id: skillShapeId
        }
      })

      if (!skillShape) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Компетенция не найдена!")
      }

      await this.requestService.removeRequestsBySkillShape(skillShapeId)

      const skills = await this.skillRepository.find({
        where: {
          skill_shape: {
            skill_shape_id: skillShapeId
          }
        }, 
        relations: {
          skill_shape: true
        }
      })

      await this.skillRepository.remove(skills)

      const skillShapeData = await this.skillShapeRepository.remove(skillShape)

      return skillShapeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async addSkillOrders(skillShapeId: number, skillLevel: skillLevel, orders: skillOrder[]): Promise<SkillOrder[]> {
    try {
      const skillShape = await this.skillShapeRepository.findOne({
        where: {
          skill_shape_id: skillShapeId
        }
      })
  
      if (!skillShape) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компетенция не найдена!')
      }
  
      const skillOrderDb = await this.getSkillOrdersByShape(skillShape.skill_name, skillLevel)
      const texts = skillOrderDb.map(el => el.order_text)
  
      for (let i = 0; i < orders.length; i++) {
        const element = orders[i];
        
        if (texts.includes(element.order_text)) {
          throw new ApiError(HttpStatus.BAD_REQUEST, "Такой навык уже существует!")
        }
      }
  
      const ordersArray = orders.map(order => {
        return new SkillOrder({
          skill_level: skillLevel,
          skill_shape: skillShape,
          order_text: order.order_text
        })
      })
  
      const ordersData = await this.skillOrderRepository.save(ordersArray)
  
      return ordersData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getSkillShapeById(skillShapeId: number): Promise<SkillShape> {
    try {
      const skillShape = await this.skillShapeRepository.findOne({
        where: {
          skill_shape_id: skillShapeId,
        },
        relations: {
          skills: true,
        },
      })

      if (!skillShape) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Компетенция не найдена!')
      }

      return skillShape
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getSkillsByCompany(companyId: number): Promise<Skill[]> {
    const skills = await this.skillRepository.find({
      where: {
        skill_shape: {
          company: {
            company_id: companyId,
          },
        },
      },
      relations: {
        skill_shape: true,
        employee: true,
      },
    })

    return skills
  }
}
