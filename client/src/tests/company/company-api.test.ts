import { createCompany } from '@/modules/company/infrastructure/company-api'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
    post: jest.fn(),
}))

// ------------------------------------------------------------
// Мокаем функции сохранения компании через алиас
// ------------------------------------------------------------
jest.mock('@/modules/company/infrastructure/company-storage', () => ({
    saveCompanyStorage: jest.fn(),
}))

// ------------------------------------------------------------
// Импорт замоканных функций
// ------------------------------------------------------------
import http from '@/libs/http/http'
import { saveCompanyStorage } from '@/modules/company/infrastructure/company-storage'

// ------------------------------------------------------------
// Тесты
// ------------------------------------------------------------
describe('company-api tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('createCompany() должно вызвать http.post и сохранить компанию', async () => {
        const mockData = { name: 'Test Company' }
        const mockResponse = {
            data: { company_id: 42, name: 'Test Company' },
        }

        ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

        const res = await createCompany(mockData)

        expect(http.post).toHaveBeenCalledWith('company/create', mockData)
        expect(saveCompanyStorage).toHaveBeenCalledWith(42)
        expect(res).toEqual(mockResponse.data)
    })

    test('createCompany() НЕ должен вызывать saveCompanyStorage, если company_id нет', async () => {
        const mockData = { name: 'No ID Company' }
        const mockResponse = {
            data: { name: 'No ID Company' },
        }

        ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

        const res = await createCompany(mockData)

        expect(http.post).toHaveBeenCalledWith('company/create', mockData)
        expect(saveCompanyStorage).not.toHaveBeenCalled()
        expect(res).toEqual(mockResponse.data)
    })
})
