import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Skill } from 'src/SkillModule/skill.entity';
import { Role } from './role.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { Team } from 'src/TeamModule/team.entity';

export interface registerEmployeeBodyDto {
    employee_name: string
    employee_surname: string
    employee_email: string
    employee_password: string
}

export interface employeePayloadDto {
    employee_id: number
    employee_name: string
    employee_surname: string
    employee_email: string
    employee_status: string
    employee_photo: string
    employeeSkills?: Skill[]
    employeeRoles?: Role[]
    company?: Company
    team?: Team
}

export interface authEmployeeBodyDto {
    employee_email: string
    employee_password: string
}

export interface authEmployeeTgBodyDto {
    employee_email: string
    employee_password: string
    tg_id: number
}

export interface registerEmployeeReturnDto {
    accessToken: string
    refreshToken: string
    payload: employeePayloadDto
}

@Controller('employee')
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService
    ) { }

    @Patch('/status')
    async setEmployeeStatus(@Req() req: Request, @Body() statusBody: { 
        status: string
    }): Promise<string> {
        try {
            const status = this.employeeService.setStatus(statusBody.status, (req as any).employee.employee_id)

            return status
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('/photo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadEmployeePhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        try {
            const status = await this.employeeService.uploadPhoto(file, (req as any).employee.employee_id)

            return status
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('/registration')
    async registerEmployee(@Body() registerEmployeeBody: registerEmployeeBodyDto, @Res({ passthrough: true }) response: Response): Promise<registerEmployeeReturnDto> {
            const data = await this.employeeService.registration(registerEmployeeBody)

            response.cookie('refreshToken', data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return data
    }

    @Post('/authorization')
    async authorizeEmployee(@Body() authEmployeeBody: authEmployeeBodyDto, @Res({ passthrough: true }) response: Response): Promise<registerEmployeeReturnDto> {
        try {
            const data = await this.employeeService.authorization(authEmployeeBody)

            response.cookie('refreshToken', data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return data
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('/authorization/telegram')
    async authorizeEmployeeTg(@Body() authEmployeeTgBody: authEmployeeTgBodyDto, @Res({ passthrough: true }) response: Response): Promise<employeePayloadDto> {
        try {
            const data = await this.employeeService.authorizationTg(authEmployeeTgBody)

            return data
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('/logout')
    async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
        try {
            const { refreshToken } = request.cookies

            const token = this.employeeService.logout(refreshToken)

            response.clearCookie('refreshToken')

            return token
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @Get('/refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        try {
            const { refreshToken } = request.cookies

            const data = await this.employeeService.refresh(refreshToken)

            response.cookie('refreshToken', data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return data
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }
}