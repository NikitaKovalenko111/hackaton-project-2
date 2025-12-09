import {
    addEmployeeToCompany,
    getCompanyEmployees,
    getCompanyEmployee,
    addEmployeeToTeam,
    deleteEmployee,
} from '@/modules/employees/infrastructure/employees-api'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
    post: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
}))

import http from '@/libs/http/http'

describe('employees-api', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // ------------------------------------------------------------
    // addEmployeeToCompany
    // ------------------------------------------------------------
    test('addEmployeeToCompany() должен вызвать http.post и вернуть данные', async () => {
        const mockData = { email: 'test@mail.com' }
        const mockResponse = { data: { employeeId: 1 } }

        ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

        const res = await addEmployeeToCompany(mockData)

        expect(http.post).toHaveBeenCalledWith(
            'company/employee/addByEmail',
            mockData
        )
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // getCompanyEmployees
    // ------------------------------------------------------------
    test('getCompanyEmployees() должен вызвать http.get и вернуть массив сотрудников', async () => {
        const mockResponse = {
            data: [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
            ],
        }

        ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

        const res = await getCompanyEmployees()

        expect(http.get).toHaveBeenCalledWith('company/employees', {})
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // getCompanyEmployee
    // ------------------------------------------------------------
    test('getCompanyEmployee() должен вызвать http.get и вернуть одного сотрудника', async () => {
        const mockResponse = { data: { id: 1, name: 'John' } }

        ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

        const res = await getCompanyEmployee(1)

        expect(http.get).toHaveBeenCalledWith('employee/profile/1', {})
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // addEmployeeToTeam
    // ------------------------------------------------------------
    test('addEmployeeToTeam() должен вызвать http.post с правильными данными и вернуть сотрудника', async () => {
        const mockData = { team_id: '5', employee_to_add_id: 10 }
        const mockResponse = { data: { id: 10, name: 'Alice' } }

        ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

        const res = await addEmployeeToTeam(mockData)

        expect(http.post).toHaveBeenCalledWith('team/add/employee', {
            team_id: 5,
            employee_to_add_id: 10,
        })
        expect(res).toEqual(mockResponse.data)
    })

    // ------------------------------------------------------------
    // deleteEmployee
    // ------------------------------------------------------------
    test('deleteEmployee() должен вызвать http.remove и вернуть данные', async () => {
        const mockResponse = { data: { success: true } }

        ;(http.remove as jest.Mock).mockResolvedValue(mockResponse)

        const res = await deleteEmployee(7)

        expect(http.remove).toHaveBeenCalledWith(
            'company/employee/remove/7',
            {}
        )
        expect(res).toEqual(mockResponse.data)
    })
})
