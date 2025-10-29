import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Skill } from 'src/SkillModule/skill.entity';
import { Role } from './role.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { Team } from 'src/TeamModule/team.entity';
import { employeeDto } from 'src/types';
import { Employee } from './employee.entity';

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
    employeeRole?: Role
    company?: Company
    team?: Team
    workedWith?: Employee[]
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
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/photo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadEmployeePhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        try {
            const status = await this.employeeService.uploadPhoto(file, (req as any).employee.employee_id)

            return status
        } catch (error) {
            throw new HttpException(error.status, error.message)
        }
    }

    @Post('/registration')
    async registerEmployee(@Body() registerEmployeeBody: registerEmployeeBodyDto, @Res({ passthrough: true }) response: Response): Promise<registerEmployeeReturnDto> {
        try {
            const data = await this.employeeService.registration(registerEmployeeBody)
    
            response.cookie('refreshToken', data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
    
            return data
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/authorization')
    async authorizeEmployee(@Body() authEmployeeBody: authEmployeeBodyDto, @Res({ passthrough: true }) response: Response): Promise<registerEmployeeReturnDto> {
        try {
            const data = await this.employeeService.authorization(authEmployeeBody)

            response.cookie('refreshToken', data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            response.statusCode = 200

            return data
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/authorization/telegram')
    async authorizeEmployeeTg(@Body() authEmployeeTgBody: authEmployeeTgBodyDto, @Res({ passthrough: true }) response: Response): Promise<employeePayloadDto> {
        try {
            const data = await this.employeeService.authorizationTg(authEmployeeTgBody)

            return data
        } catch (error) {
            throw new HttpException(error.message, error.status)
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
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('/refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        try {
            const { refreshToken } = request.cookies

            console.log(refreshToken);

            const data = await this.employeeService.refresh(refreshToken)

            console.log(data);

            response.cookie('refreshToken', data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return data
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/profile')
    async getProfile(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<employeeDto> {
        try {
            const employeeId = (request as any).employee.employee_id

            if (!employeeId) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
            }

            const profile = await this.employeeService.getEmployee(employeeId)

            const profileData = new employeeDto(profile)

            return profileData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Get('/profile/:id')
    async getProfileById(@Req() request: Request, @Param('id') id: number): Promise<employeeDto> {
        try {
            const profile = await this.employeeService.getEmployeeById(id)

            const profileData = new employeeDto(profile)

            return profileData
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}