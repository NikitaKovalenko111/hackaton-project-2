import { Test, TestingModule } from '@nestjs/testing'
import { TokenService } from 'src/EmployeeModule/token.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Employee_token } from 'src/EmployeeModule/token.entity'
import ApiError from 'src/apiError'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('TokenService', () => {
  let service: TokenService
  let repo: any

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: getRepositoryToken(Employee_token), useValue: repo },
      ],
    }).compile()

    service = module.get<TokenService>(TokenService)

    process.env.JWT_ACCESS_SECRET = 'access'
    process.env.JWT_REFRESH_SECRET = 'refresh'
  })

  // ------------ generateTokens ------------

  it('should generate access and refresh tokens', () => {
    ;(jwt.sign as jest.Mock).mockImplementation(() => 'token')

    const result = service.generateTokens({ id: 1 })

    expect(result).toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    })

    expect(jwt.sign).toHaveBeenCalled()
  })

  // ------------ validateAccessToken ------------

  it('should validate access token', async () => {
    ;(jwt.verify as jest.Mock).mockReturnValue({ id: 1 })

    const result = await service.validateAccessToken('token123')

    expect(result).toEqual({ id: 1 })
    expect(jwt.verify).toHaveBeenCalled()
  })

  it('should throw ApiError on invalid access token', async () => {
    ;(jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid')
    })

    await expect(service.validateAccessToken('badtoken')).rejects.toThrow(
      ApiError,
    )
  })

  // ------------ validateRefreshToken ------------

  it('should validate refresh token', async () => {
    ;(jwt.verify as jest.Mock).mockReturnValue({ id: 1 })

    const result = await service.validateRefreshToken('ref123')

    expect(result).toEqual({ id: 1 })
  })

  // ------------ saveToken ------------

  it('should update existing token', async () => {
    const existing = { employee_id: 1, token_data: 'old' }

    repo.findOne.mockResolvedValue(existing)
    repo.save.mockResolvedValue({ ...existing, token_data: 'newtoken' })

    const result = await service.saveToken(1, 'newtoken')

    expect(result.token_data).toBe('newtoken')
    expect(repo.save).toHaveBeenCalled()
  })

  it('should create new token if not exists', async () => {
    repo.findOne.mockResolvedValue(null)
    repo.save.mockImplementation(async (x) => x) // returns saved object

    const result = await service.saveToken(5, 'abc')

    expect(result.token_data).toBe('abc')
    expect(result.employee_id).toBe(5)
  })

  // ------------ removeToken ------------

  it('should remove token', async () => {
    const tokenObj = { token_data: 'abcd' }

    repo.findOne.mockResolvedValue(tokenObj)
    repo.remove.mockResolvedValue(true)

    const result = await service.removeToken('abcd')

    expect(repo.remove).toHaveBeenCalledWith(tokenObj)
    expect(result).toBe('abcd')
  })

  it('should return undefined if token not found', async () => {
    repo.findOne.mockResolvedValue(null)

    const result = await service.removeToken('xyz')

    expect(result).toBeUndefined()
  })

  // ------------ findToken ------------

  it('should find token in db', async () => {
    repo.findOne.mockResolvedValue({ token_data: '123' })

    const result = await service.findToken('123')

    expect(result).toEqual({ token_data: '123' })
  })
})
