import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/EmployeeModule/employee.entity';
import { SkillShape } from './skillShape.entity';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { skillLevel } from 'src/types';
import { employeePayloadDto } from 'src/EmployeeModule/employee.controller';

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

    async giveSkill(employee: Employee, skillShapeId: number, skillLevel: skillLevel) {
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
            skill_shape: skillShape,
            skill_level: skillLevel
        })

        const skillData = await this.skillRepository.save(skill)

        return skillData
    }

    async giveSkillToMany(needEmployees: employeePayloadDto[], skill_shape_id: number, skill_level: skillLevel) {
        const skills: Skill[] = []
        const skillShape = await this.skillShapeRepository.findOne({
            where: {
                skill_shape_id: skill_shape_id
            }
        })
        
        if (!skillShape) {
            throw new Error('Компетенция не найдена!')
        }

        for (const employee of needEmployees) {
            const skill = new Skill({
                employee: employee as Employee,
                skill_shape: skillShape,
                skill_level: skill_level
            })

            skills.push(skill)
        }

        const skillData = await this.skillRepository.save(skills)

        return skillData
    }

    async updateSkillLevel(skillId: number, skillLevel: skillLevel): Promise<Skill> {
        const skill = await this.skillRepository.findOne({
            where: {
                skill_connection_id: skillId
            }
        })

        if (!skill) {
            throw new Error('Компетенция не найдена!')
        }

        skill.skill_level = skillLevel

        const skillData = await this.skillRepository.save(skill)

        return skillData
    }

    async deleteSkill(skillId: number): Promise<Skill> {
        const skill = await this.skillRepository.delete({
            skill_connection_id: skillId
        })

        return skill.raw
    }
}
