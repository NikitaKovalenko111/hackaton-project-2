import {
  getTeams,
  getTeamInfo,
  addTeam,
  deleteTeam,
} from '@/modules/teams/infrastructure/teams-api'
import { AddTeamDTO, Team } from '@/modules/teams/domain/teams.type'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
  get: jest.fn(),
  post: jest.fn(),
  remove: jest.fn(),
}))

import http from '@/libs/http/http'

describe('teams-api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getTeams() должен вызвать http.get и вернуть массив команд', async () => {
    const mockResponse = { data: [{ id: 1, team_name: 'Team A' }] as Team[] }
    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await getTeams(5)

    expect(http.get).toHaveBeenCalledWith('/company/5/teams', {})
    expect(res).toEqual(mockResponse.data)
  })

  test('getTeamInfo() должен вызвать http.get и вернуть информацию о команде', async () => {
    const mockResponse = { data: { id: 1, team_name: 'Team A' } as Team }
    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await getTeamInfo()

    expect(http.get).toHaveBeenCalledWith('team/info', {})
    expect(res).toEqual(mockResponse.data)
  })

  test('addTeam() должен вызвать http.post с правильными данными и вернуть команду', async () => {
    const mockData: AddTeamDTO = {
      company_id: 1,
      team_desc: 'New team description',
      team_name: 'Team B',
      teamlead_id: '10',
    }

    const mockResponse = { data: { id: 2, team_name: 'Team B' } as Team }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await addTeam(mockData)

    expect(http.post).toHaveBeenCalledWith('team/add', {
      company_id: 1,
      team_desc: 'New team description',
      team_name: 'Team B',
      teamlead_id: 10,
    })
    expect(res).toEqual(mockResponse.data)
  })

  test('deleteTeam() должен вызвать http.remove и вернуть данные', async () => {
    const mockResponse = { data: { success: true } }

    ;(http.remove as jest.Mock).mockResolvedValue(mockResponse)

    const res = await deleteTeam(3)

    expect(http.remove).toHaveBeenCalledWith('team/remove/3', {})
    expect(res).toEqual(mockResponse.data)
  })
})
