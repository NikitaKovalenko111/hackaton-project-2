import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { SkillShape } from './skillShape.entity';
import { Repository } from 'typeorm';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Skill } from './skill.entity';
import { Company } from 'src/CompanyModule/company.entity';

@Injectable()
export class SkillService {
    constructor(
        @InjectRepository(SkillShape)
        private skillShapeRepository: Repository<SkillShape>,

        @InjectRepository(Skill)
        private skillRepository: Repository<Skill>,

        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) {}

    async createSkill(skillName: string, skillDesc: string, companyId: number): Promise<SkillShape> {
        const company = await this.companyRepository.findOne({
            where: {
                company_id: companyId
            }
        })
        if (!company) {
            throw new Error("Компания не найдена")
        }
        const skill = new SkillShape({
            skill_name: skillName,
            skill_desc: skillDesc,
            company: company
        })

        await this.skillShapeRepository.save(skill)

        return skill
    }

    async giveSkill(employee: Employee, skillShapeId: number) {
        const skillShape = await this.skillShapeRepository.findOne({
            where: {
                skill_shape_id: skillShapeId
            }
        })

        if (!skillShape) {
            throw new Error('Такой компетенции нет в компании!')
        }

        const skill = new Skill({
            employee: employee,
            skill_shape: skillShape
        })

        const skillData = await this.skillRepository.save(skill)

        return skillData
    }
}
