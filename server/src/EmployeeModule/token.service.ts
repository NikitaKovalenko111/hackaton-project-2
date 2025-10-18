import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken'
import { Repository } from 'typeorm';
import { Employee_token } from './token.entity';

interface payloadDto {
    employee_id: number
    employee_name: string
    employee_surname: string
    employee_status: string | null
    employee_photo: string | null
    employee_email: string
}

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Employee_token)
        private tokenRepository: Repository<Employee_token>,
    ) {}

    generateTokens(payload: payloadDto) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
            expiresIn: '30m'
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
            expiresIn: '30d'
        })

        return {
            accessToken,
            refreshToken
        }
    }

    async validateAccessToken(accessToken: string) {
        try {
            const employeeData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string)
            
            return employeeData
        } catch (error) {
            return null
        }
    }

    async validateRefreshToken(refreshToken: string) {
        try {
            const employeeData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string)

            return employeeData
        } catch (error) {
            return null
        }
    }

    async saveToken(employeeId: number, refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({
            where: {
                employee_id: employeeId
            }
        })

        if (tokenData) {
            tokenData.token_data = refreshToken

            return await this.tokenRepository.save(tokenData)
        }

        const tokenFetch = new Employee_token({
            token_data: refreshToken,
            employee_id: employeeId
        })

        const token = await this.tokenRepository.save(tokenFetch)

        return token
    }

    async removeToken(refreshToken: string): Promise<string> {
        const tokenData = await this.tokenRepository.findOne({
            where: {
                token_data: refreshToken
            }
        })

        if (tokenData) {
            await this.tokenRepository.remove(tokenData)
        }

        return tokenData?.token_data as string
    }

    async findToken(token: string) {
        const dbToken = await this.tokenRepository.findOne({
            where: {
                token_data: token
            }
        })

        return dbToken
    }
}