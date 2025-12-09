import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Проверка работы сервера' })
  @ApiResponse({ status: 200, description: 'Сервер отвечает "Hello World!"' })
  getHello(): string {
    return this.appService.getHello()
  }
}
