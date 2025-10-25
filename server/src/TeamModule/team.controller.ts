import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.entity';
import { employeeDto } from 'src/types';

interface addTeamBodyDto {
    company_id: number
    team_desc: string | null
    team_name: string
    teamlead_id: number
}

interface addEmployeeBodyDto {
    team_id: number,
    employee_to_add_id: number
}

@Controller('team')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
    ) { }

    @Get('/info')
    async getTeamInfo(@Req() req: Request): Promise<Team> {
        const employee = (req as any).employee

        const team = await this.teamService.getTeam(employee.team.team_id)

        return team
    }

    @Post('/add')
    async addTeam(@Body() addTeamBody: addTeamBodyDto, @Req() req: Request): Promise<Team> {
        const employeeId = (req as any).employee.employee_id

        const { company_id, team_desc, team_name, teamlead_id } = addTeamBody

        const team = await this.teamService.addTeam(company_id, team_name, team_desc, teamlead_id)

        return team
    }

    @Post('/add/employee')
    async addEmployeeToTeam(@Body() addEmployeeBody: addEmployeeBodyDto, @Req() req: Request): Promise<employeeDto> {
        const employeeId = (req as any).employee.employee_id

        const { team_id, employee_to_add_id } = addEmployeeBody

        const employeeData = await this.teamService.addEmployeeToTeam(team_id, employee_to_add_id)

        const employeeDtoData = new employeeDto(employeeData)

        return employeeDtoData
    }
}