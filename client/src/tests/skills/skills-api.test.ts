import {
  getAllSkills,
  createSkill,
  getSkillById,
  giveSkill,
  removeSkill,
  removeSkillFromCompany,
  getSkillOrders,
  createSkillOrder,
} from '@/modules/skills/infrastructure/skills-api'
import {
  CreateSkillDTO,
  GiveSkillDTO,
  SkillOrderDTO,
  SkillOrderGet,
  SkillShape,
} from '@/modules/skills/domain/skills.types'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
  get: jest.fn(),
  post: jest.fn(),
  remove: jest.fn(),
}))

import http from '@/libs/http/http'

describe('skills-api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getAllSkills() должен вызвать http.get и вернуть массив навыков', async () => {
    const mockResponse = { data: [{ id: 1, name: 'JS' }] as SkillShape[] }
    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await getAllSkills()

    expect(http.get).toHaveBeenCalledWith('company/skills', {})
    expect(res).toEqual(mockResponse.data)
  })

  test('createSkill() должен вызвать http.post и вернуть данные', async () => {
    const mockData: CreateSkillDTO = { name: 'TypeScript' }
    const mockResponse = { data: { id: 2, name: 'TypeScript' } }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await createSkill(mockData)

    expect(http.post).toHaveBeenCalledWith('company/skill/create', mockData)
    expect(res).toEqual(mockResponse.data)
  })

  test('getSkillById() должен вызвать http.get и вернуть навык', async () => {
    const mockResponse = { data: { id: 1, name: 'JS' } as SkillShape }
    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await getSkillById(1)

    expect(http.get).toHaveBeenCalledWith('skill/skillShape/1', {})
    expect(res).toEqual(mockResponse.data)
  })

  test('giveSkill() должен вызвать http.post и вернуть результат', async () => {
    const mockData: GiveSkillDTO = { employeeId: 1, skillId: 2 }
    const mockResponse = { data: { success: true } }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await giveSkill(mockData)

    expect(http.post).toHaveBeenCalledWith('company/skill/give', mockData)
    expect(res).toEqual(mockResponse.data)
  })

  test('removeSkill() должен вызвать http.remove с правильным URL', async () => {
    ;(http.remove as jest.Mock).mockResolvedValue({})

    await removeSkill(5)

    expect(http.remove).toHaveBeenCalledWith('skill/5/delete', {})
  })

  test('removeSkillFromCompany() должен вызвать http.remove с правильным URL', async () => {
    ;(http.remove as jest.Mock).mockResolvedValue({})

    await removeSkillFromCompany(10)

    expect(http.remove).toHaveBeenCalledWith('company/skillShape/remove/10', {})
  })

  test('getSkillOrders() должен вызвать http.get с правильными параметрами и вернуть массив заказов', async () => {
    const skillNames = ['JS', 'TS']
    const mockResponse = { data: [{ skillName: 'JS' }, { skillName: 'TS' }] as SkillOrderGet[] }

    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await getSkillOrders(skillNames)

    const params = new URLSearchParams()
    params.append('skillShapeName', 'JS')
    params.append('skillShapeName', 'TS')

    expect(http.get).toHaveBeenCalledWith(`skill/skillOrder/get?${params}`, {})
    expect(res).toEqual(mockResponse.data)
  })

  test('createSkillOrder() должен вызвать http.post и вернуть данные', async () => {
    const mockData: SkillOrderDTO = { skillId: 1, employeeId: 2 }
    const mockResponse = { data: { id: 1, skillId: 1, employeeId: 2 } }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await createSkillOrder(mockData)

    expect(http.post).toHaveBeenCalledWith('skill/skillOrder/add', mockData)
    expect(res).toEqual(mockResponse.data)
  })
})
