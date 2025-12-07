import { register, login, refreshToken } from '@/modules/auth/infrastructure/auth-api'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
  post: jest.fn(),
  get: jest.fn(),
}))

// ------------------------------------------------------------
// Мокаем функции сохранения токенов
// ------------------------------------------------------------
jest.mock('@/modules/auth/infrastructure/auth-token', () => ({
  saveTokenStorage: jest.fn(),
  saveRefreshStorage: jest.fn(),
  saveRoleStorage: jest.fn(),
}))

// ------------------------------------------------------------
// Мокаем функции сохранения компании
// ------------------------------------------------------------
jest.mock('@/modules/company/infrastructure/company-storage', () => ({
  saveCompanyStorage: jest.fn(),
}))

// ------------------------------------------------------------
// Импорт замоканных функций
// ------------------------------------------------------------
import http from '@/libs/http/http'
import { saveTokenStorage, saveRefreshStorage, saveRoleStorage } from '@/modules/auth/infrastructure/auth-token'
import { saveCompanyStorage } from '@/modules/company/infrastructure/company-storage'

// ------------------------------------------------------------
// Тесты
// ------------------------------------------------------------
describe('auth-api tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ------------------------------------------------------------
  // REGISTER
  // ------------------------------------------------------------
  test('register() должно вызвать http.post и сохранить токены', async () => {
    const mockResponse = {
      data: {
        accessToken: 'abc123',
        refreshToken: 'ref123',
      },
    }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await register({ email: 'test@test.com', password: '1234' })

    expect(http.post).toHaveBeenCalledWith(
      'employee/registration',
      { email: 'test@test.com', password: '1234' },
      {}
    )

    expect(saveTokenStorage).toHaveBeenCalledWith('abc123')
    expect(saveRefreshStorage).toHaveBeenCalledWith('ref123')
    expect(res).toEqual(mockResponse.data)
  })

  // ------------------------------------------------------------
  // LOGIN
  // ------------------------------------------------------------
  test('login() должно сохранить токены, роль и компанию', async () => {
    const mockResponse = {
      data: {
        accessToken: 'xyz',
        refreshToken: 'refresh-xyz',
        payload: {
          role: { role_name: 'ADMIN' },
          company: { company_id: 42 },
        },
      },
    }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await login({ email: 'user@mail.com', password: '1234' })

    expect(http.post).toHaveBeenCalledWith(
      'employee/authorization',
      { email: 'user@mail.com', password: '1234' },
      {}
    )

    expect(saveTokenStorage).toHaveBeenCalledWith('xyz')
    expect(saveRefreshStorage).toHaveBeenCalledWith('refresh-xyz')
    expect(saveRoleStorage).toHaveBeenCalledWith('ADMIN')
    expect(saveCompanyStorage).toHaveBeenCalledWith(42)

    expect(res).toEqual(mockResponse.data)
  })

  test('login() НЕ должен вызывать saveRoleStorage если роли нет', async () => {
    const mockResponse = {
      data: {
        accessToken: 'abc',
        refreshToken: 'ref',
        payload: {
          role: null,
          company: null,
        },
      },
    }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    await login({ email: 'a', password: 'b' })

    expect(saveRoleStorage).not.toHaveBeenCalled()
    expect(saveCompanyStorage).not.toHaveBeenCalled()
  })

  // ------------------------------------------------------------
  // REFRESH TOKEN
  // ------------------------------------------------------------
  test('refreshToken() должно вызвать http.get и обновить токены', async () => {
    const mockResponse = {
      data: {
        accessToken: 'newAccess',
        refreshToken: 'newRefresh',
      },
    }

    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await refreshToken()

    expect(http.get).toHaveBeenCalledWith('employee/refresh', {
      withCredentials: true,
    })

    expect(saveTokenStorage).toHaveBeenCalledWith('newAccess')
    expect(saveRefreshStorage).toHaveBeenCalledWith('newRefresh')

    expect(res).toEqual(mockResponse.data)
  })
})
