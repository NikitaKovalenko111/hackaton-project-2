import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { CompanyService } from 'src/CompanyModule/company.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { Employee } from 'src/EmployeeModule/employee.entity';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,

        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    
        private companyService: CompanyService,
        private employeeService: EmployeeService
    ) {}

    async addTeam(companyId: number, teamName: string, teamDesc: string | null, teamlead_id: number): Promise<Team> {
        const company = await this.companyService.getCompanyInfo(companyId)
        const teamlead = await this.employeeService.getEmployee(teamlead_id)

        const team = new Team({
            team_name: teamName,
            team_desc: teamDesc ? teamDesc : undefined,
            teamlead: teamlead,
            company: company
        })

        const teamData = await this.teamRepository.save(team)

        const teamleadData = await this.addEmployeeToTeam(teamData.team_id, teamData.teamlead.employee_id)

        return teamData
    }

    async addEmployeeToTeam(teamId: number, employeeId: number): Promise<Employee> {
        const employee = await this.employeeService.getEmployee(employeeId)
        const team = await this.teamRepository.findOne({
            where: {
                team_id: teamId
            },
            relations: {
                employees: true
            }
        })

        if (!team) {
            throw new Error('Команда не найдена!')
        }

        employee.team = team
        const history: Employee[] = []
        
        for (let i = 0; i < employee.team.employees.length; i++) {
            const element = employee.team.employees[i]
            
            if (element.employee_id != employee.employee_id) {
                history.push(element)
            }
        }
        employee.workedWith = history

        const employeeData = await this.employeeRepository.save(employee)

        return employeeData
    }

    async getTeam(teamId: number): Promise<Team> {
        const team = await this.teamRepository.findOne({
            where: {
                team_id: teamId
            },
            relations: {
                teamlead: true,
                employees: true,
                company: true
            }
        })

        if (!team) {
            throw new Error('Команда не найдена!')
        }

        return team
    }
}
