import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiExtraModels,
  ApiProduces,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service'
import type { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { employeeDto } from 'src/types'
import {
  authEmployeeBodyDto,
  authEmployeeTgBodyDto,
  changePasswordBodyDto,
  changeProfileDataBodyDto,
  employeePayloadDto,
  registerEmployeeBodyDto,
  registerEmployeeReturnDto,
} from './employee.dto'
import { Employee } from './employee.entity';
import { Company } from 'src/CompanyModule/company.entity';
import { Skill } from 'src/SkillModule/skill.entity';
import { Team } from 'src/TeamModule/team.entity';
import { Role } from './role.entity';
import { EmployeeRegistrationDto, EmployeeAuthResponseDto, EmployeeLoginDto, EmployeeLoginResponseDto } from './employee.dto';
import { join } from 'path';
import { createReadStream } from 'fs';


@ApiTags('employee')
@ApiExtraModels(Employee, Company, Skill, Team, Role)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Patch('/status')
  @ApiOperation({ summary: 'Изменить статус сотрудника' })
  @ApiBody({
    schema: {
      example: { status: 'В отпуске' },
    },
  })
  @ApiResponse({ status: 200, description: 'Новый статус сотрудника', type: String })
  async setEmployeeStatus(
    @Req() req: Request,
    @Body()
    statusBody: {
      status: string
    },
  ): Promise<string> {
    try {
      const status = this.employeeService.setStatus(
        statusBody.status,
        (req as any).employee.employee_id,
      )

      return status
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Patch('/profile')
  @ApiOperation({ summary: 'Изменить данные профиля сотрудника' })
  @ApiBody({ type: changeProfileDataBodyDto })
  @ApiResponse({ status: 200, description: 'Обновлённый профиль сотрудника', type: Employee })
  async changeProfileData(@Req() req: Request, @Body() changeProfileDataBody: changeProfileDataBodyDto): Promise<Employee> {
    try {
      const employeeId = (req as any).employee.employee_id
  
      const employeeData = await this.employeeService.updateProfile(changeProfileDataBody, employeeId)
  
      return employeeData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/profile/photo')
  @ApiOperation({ summary: 'Получить фото профиля текущего сотрудника' })
  @ApiProduces('image/*')
  @ApiResponse({
    status: 200,
    description: 'Фото профиля в бинарном формате',
    content: {
      'image/*': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Фото не найдено' })
  @ApiBearerAuth()
  async getProfilePhoto(@Req() req: Request, @Res() res: Response): Promise<StreamableFile> {
    try {
      const employeeId = (req as any).employee.employee_id

      const employee = await this.employeeService.getCleanEmployee(employeeId)

      const imagePath = join(process.cwd(), '../profilePhotos', `${employee.employee_photo}`)

      const file = createReadStream(imagePath)

      res.set({
        'Content-Type': `image/${employee.employee_photo.split(".")[1]}`
      })

      return new StreamableFile(file, {
        "type": `image/${employee.employee_photo.split(".")[1]}`
      })
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Patch('/change/password')
  @ApiOperation({ summary: 'Изменить пароль сотрудника' })
  @ApiBody({ type: changePasswordBodyDto })
  @ApiResponse({ status: 200, description: 'Пароль успешно изменён', type: Employee })
  async changePassword(@Req() req: Request, @Body() changePasswordBody: changePasswordBodyDto): Promise<Employee> {
    try {
      const employeeId = (req as any).employee.employee_id
  
      const { new_password, old_password } = changePasswordBody
  
      const employeeData = await this.employeeService.changePassword(new_password, old_password, employeeId)
  
      return employeeData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/photo')
  @ApiOperation({ summary: 'Загрузить фото профиля сотрудника' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Файл изображения профиля' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Имя загруженного файла', type: String })
  @UseInterceptors(FileInterceptor('file'))
  async uploadEmployeePhoto(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const status = await this.employeeService.uploadPhoto(
        file,
        (req as any).employee.employee_id,
      )

      return status
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/registration')
  @ApiOperation({ summary: 'Регистрация нового сотрудника' })
  @ApiBody({
    type: EmployeeRegistrationDto,
    description: 'Данные для регистрации нового сотрудника',
  })
  @ApiCreatedResponse({
    description: 'Успешная регистрация',
    type: EmployeeAuthResponseDto,
  })
  async registerEmployee(
    @Body() registerEmployeeBody: registerEmployeeBodyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<registerEmployeeReturnDto> {
    try {
      const data = await this.employeeService.registration(registerEmployeeBody)

      response.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return data
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/authorization')
  @ApiOperation({ summary: 'Авторизация по email и паролю' })
  @ApiBody({
    type: EmployeeLoginDto,
    description: 'Авторизация по email и паролю',
  })
  @ApiOkResponse({
    description: 'Авторизованный пользователь',
    type: EmployeeLoginResponseDto,
  })
  async authorizeEmployee(
    @Body() authEmployeeBody: authEmployeeBodyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<registerEmployeeReturnDto> {
    try {
      const data = await this.employeeService.authorization(authEmployeeBody)

      response.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      response.statusCode = 200

      return data
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/authorization/telegram')
  @ApiOperation({ summary: 'Авторизация сотрудника через Telegram' })
  @ApiBody({ type: authEmployeeTgBodyDto })
  @ApiResponse({ status: 200, type: employeePayloadDto, description: 'Авторизованный пользователь' })
  async authorizeEmployeeTg(
    @Body() authEmployeeTgBody: authEmployeeTgBodyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<employeePayloadDto> {
    try {
      const data =
        await this.employeeService.authorizationTg(authEmployeeTgBody)

      return data
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Выход из системы (удаление refresh токена)' })
  @ApiResponse({ status: 200, description: 'Статус выхода', type: String })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
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
  @ApiOperation({ summary: 'Обновить токены сотрудника' })
  @ApiResponse({ status: 200, type: registerEmployeeReturnDto, description: 'Новые токены доступа' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { refreshToken } = request.cookies

      const data = await this.employeeService.refresh(refreshToken)

      response.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return data
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Получить профиль текущего сотрудника' })
  @ApiResponse({ status: 200, type: Employee, description: 'Профиль сотрудника' })
  async getProfile(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<employeeDto> {
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
  @ApiOperation({ summary: 'Получить профиль сотрудника по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID сотрудника' })
  @ApiResponse({ status: 200, type: employeeDto, description: 'Профиль сотрудника' })
  async getProfileById(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<employeeDto> {
    try {
      const profile = await this.employeeService.getEmployeeById(id)

      const profileData = new employeeDto(profile)

      return profileData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
