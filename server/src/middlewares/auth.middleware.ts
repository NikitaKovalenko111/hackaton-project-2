import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { TokenService } from 'src/EmployeeModule/token.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly employeeService: EmployeeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization

      if (!authorization) {
        return next(
          new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED),
        )
      }

      const accessToken = authorization.split(' ')[1]

      if (!accessToken) {
        return next(
          new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED),
        )
      }

      const employeeDataToken =
        await this.tokenService.validateAccessToken(accessToken)

      if (!employeeDataToken) {
        return next(
          new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED),
        )
      }

      const employeeData = await this.employeeService.getEmployee(
        (employeeDataToken as Employee).employee_id,
      )

      ;(req as any).employee = {
        employee_id: employeeData.employee_id,
        employee_email: employeeData.employee_email,
        company_id: employeeData.company?.company_id,
        team_id: employeeData.team?.team_id,
        role: employeeData.role?.role_id,
      }

      next()
    } catch (error) {
      return next(
        new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED),
      )
    }
  }
}
