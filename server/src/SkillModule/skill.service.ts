import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { SkillShape } from './skillShape.entity';
import { Repository } from 'typeorm';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Skill } from './skill.entity';

@Injectable()
export class SkillService {
    constructor(
        @InjectRepository(SkillShape)
        private skillShapeRepository: Repository<SkillShape>,
    
        private employeeService: EmployeeService
    ) {}

    async giveSkill(employee: Employee, skillShapeId: number) {
        const skillShape = await this.skillShapeRepository.findOne({
            where: {
                skill_shape_id: skillShapeId
            }
        })

        if (!skillShape) {
            throw new Error('Такой компетенции в компании не существует!')
        }

        const skill = new Skill({})

        skillShape.addSkill(skill)

        await this.skillShapeRepository.save(skillShape)

        await this.employeeService.saveSkill(skill, employee)

        return skill
    }
}
