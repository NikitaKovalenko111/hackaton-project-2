import { addInterview, getInterviewPlanned } from '@/modules/interviews/infrastructure/interviews-api'
import { InterviewDTO, InterviewData } from '@/modules/interviews/domain/interviews.types'

// ------------------------------------------------------------
// Мокаем http-клиент
// ------------------------------------------------------------
jest.mock('@/libs/http/http', () => ({
  post: jest.fn(),
  get: jest.fn(),
}))

import http from '@/libs/http/http'

describe('interviews-api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ------------------------------------------------------------
  // addInterview
  // ------------------------------------------------------------
  test('addInterview() должен вызвать http.post с правильными данными и вернуть результат', async () => {
    const mockData: InterviewDTO = {
      interview_subject: '5',
      interview_date: '2025-12-01',
      interview_type: 'online',
      interview_desc: 'Technical interview',
    }

    const mockResponse = {
      data: {
        id: 1,
        interview_subject: 5,
        interview_date: '2025-12-01',
        interview_type: 'online',
        interview_desc: 'Technical interview',
      } as InterviewData,
    }

    ;(http.post as jest.Mock).mockResolvedValue(mockResponse)

    const res = await addInterview(mockData)

    expect(http.post).toHaveBeenCalledWith('interview/add', {
      interview_subject: 5,
      interview_date: '2025-12-01',
      interview_type: 'online',
      interview_desc: 'Technical interview',
    })
    expect(res).toEqual(mockResponse.data)
  })

  // ------------------------------------------------------------
  // getInterviewPlanned
  // ------------------------------------------------------------
  test('getInterviewPlanned() должен вызвать http.get и вернуть массив интервью', async () => {
    const mockResponse: { data: InterviewData[] } = {
      data: [
        {
          id: 1,
          interview_subject: 5,
          interview_date: '2025-12-01',
          interview_type: 'online',
          interview_desc: 'Technical interview',
        },
        {
          id: 2,
          interview_subject: 3,
          interview_date: '2025-12-02',
          interview_type: 'offline',
          interview_desc: 'HR interview',
        },
      ],
    }

    ;(http.get as jest.Mock).mockResolvedValue(mockResponse)

    const res = await getInterviewPlanned()

    expect(http.get).toHaveBeenCalledWith('interview/get', {})
    expect(res).toEqual(mockResponse.data)
  })
})
