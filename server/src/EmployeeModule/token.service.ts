import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import jwt from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { Employee_token } from './token.entity'
import ApiError from 'src/apiError'
import type { payloadDto } from './token.dto'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Employee_token)
    private tokenRepository: Repository<Employee_token>,
  ) {}

  generateTokens(payload: payloadDto) {
    try {
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET as string,
        {
          expiresIn: '1d',
        },
      )
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        {
          expiresIn: '30d',
        },
      )

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async validateAccessToken(accessToken: string) {
    try {
      const employeeData = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const employeeData = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )

      return employeeData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async saveToken(employeeId: number, refreshToken: string) {
    try {
      const tokenData = await this.tokenRepository.findOne({
        where: {
          employee_id: employeeId,
        },
      })

      if (tokenData) {
        tokenData.token_data = refreshToken

        return await this.tokenRepository.save(tokenData)
      }

      const tokenFetch = new Employee_token({
        token_data: refreshToken,
        employee_id: employeeId,
      })

      const token = await this.tokenRepository.save(tokenFetch)

      return token
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async removeToken(refreshToken: string): Promise<string> {
    try {
      const tokenData = await this.tokenRepository.findOne({
        where: {
          token_data: refreshToken,
        },
      })

      if (tokenData) {
        await this.tokenRepository.remove(tokenData)
      }

      return tokenData?.token_data as string
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async findToken(token: string) {
    try {
      const dbToken = await this.tokenRepository.findOne({
        where: {
          token_data: token,
        },
      })

      return dbToken
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
