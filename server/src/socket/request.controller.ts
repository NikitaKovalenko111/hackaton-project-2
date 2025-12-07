import { Controller, Get, HttpException, Req } from '@nestjs/common'
import { RequestService } from './request.service'
import { Request as RequestEntity } from './request.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('requests')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('/received/getAll')
  @ApiOperation({ summary: 'Получить все входящие запросы текущего пользователя' })
  @ApiResponse({ status: 200, type: [RequestEntity] })
  async getAllReceivedRequest(@Req() req: Request) {
    try {
      const employeeId = (req as any).employee.employee_id

      const requests = await this.requestService.getReceivedRequests(employeeId)

      return requests
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/sended/getAll')
  @ApiOperation({ summary: 'Получить все отправленные запросы текущего пользователя' })
  @ApiResponse({ status: 200, type: [RequestEntity] })
  async getAllSendedRequest(@Req() req: Request) {
    try {
      const employeeId = (req as any).employee.employee_id

      const requests = await this.requestService.getSendedRequests(employeeId)

      return requests
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
