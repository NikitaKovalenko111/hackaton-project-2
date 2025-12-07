import {
    getProfile,
    logout,
    getTeam,
    getRequests,
    requestAiPlan,
} from '@/modules/profile/infrastructure/profile-api'
import {
    AiPlanDTO,
    AiPlanData,
    Employee,
} from '@/modules/profile/domain/profile.types'
import { Request } from '@/libs/constants'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
    get: jest.fn(),
    post: jest.fn(),
}))

import http from '@/libs/http/http'

// ------------------------------------------------------------
// Мокаем Cookies
// ------------------------------------------------------------
jest.mock('js-cookie', () => ({
    remove: jest.fn(),
}))

const Cookies = require('js-cookie')

describe('profile-api', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // ------------------------------------------------------------
    // getProfile
    // ------------------------------------------------------------
    test('getProfile() должен вызвать http.get и вернуть данные сотрудника', async () => {
        const mockResponse = { data: { id: 1, name: 'John Doe' } as Employee }

        ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

        const res = await getProfile()

        expect(http.get).toHaveBeenCalledWith('employee/profile', {})
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // logout
    // ------------------------------------------------------------
    test('logout() должен вызвать http.post и удалить куки', async () => {
        const mockResponse = { data: { success: true } }

        ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

        const res = await logout()

        expect(http.post).toHaveBeenCalledWith(
            'employee/logout',
            {},
            { withCredentials: true }
        )

        expect(Cookies.remove).toHaveBeenCalledWith('accessToken')
        expect(Cookies.remove).toHaveBeenCalledWith('refreshToken')
        expect(Cookies.remove).toHaveBeenCalledWith('role')
        expect(Cookies.remove).toHaveBeenCalledWith('companyId')

        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // getTeam
    // ------------------------------------------------------------
    test('getTeam() должен вызвать http.get и вернуть данные команды', async () => {
        const mockResponse = { data: { teamId: 5, members: [] } }

        ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

        const res = await getTeam()

        expect(http.get).toHaveBeenCalledWith('team/info', {})
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // getRequests
    // ------------------------------------------------------------
    test('getRequests() должен вызвать http.get и вернуть массив запросов', async () => {
        const mockResponse = { data: [{ id: 1 }, { id: 2 }] as Request[] }

        ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

        const res = await getRequests()

        expect(http.get).toHaveBeenCalledWith('request/received/getAll', {})
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // requestAiPlan
    // ------------------------------------------------------------
    test('requestAiPlan() должен вызвать http.post и вернуть данные плана', async () => {
        const mockData: AiPlanDTO = { planId: 1 }
        const mockResponse = { data: { planId: 1, status: 'ok' } as AiPlanData }

        ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

        const res = await requestAiPlan(mockData)

        expect(http.post).toHaveBeenCalledWith('ai/get/plan', mockData)
        expect(res).toEqual(mockResponse.data)
    })
})
