import { Controller, Get, HttpException, Req } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
    constructor(
        private readonly requestService: RequestService
    ) { }

    @Get('/received/getAll')
    async getAllReceivedRequest(@Req() req: Request) {
        try {
            const employeeId = (req as any).employee.employee_id
    
            const requests = await this.requestService.getReceivedRequests(employeeId)
    
            return requests
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}