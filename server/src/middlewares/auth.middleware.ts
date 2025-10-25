import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/EmployeeModule/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private tokenService: TokenService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.headers.authorization
            
            if (!authorization) {
                return next(new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED))
            }

            const accessToken = authorization.split(" ")[1]

            if (!accessToken) {
                return next(new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED))
            }

            const employeeData = await this.tokenService.validateAccessToken(accessToken)

            if (!employeeData) {
                return next(new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED))
            }

            (req as any).employee = employeeData

            next()
        } catch(error) {
            return next(new HttpException('Вы не авторизованы', HttpStatus.UNAUTHORIZED))
        }
    }
}
