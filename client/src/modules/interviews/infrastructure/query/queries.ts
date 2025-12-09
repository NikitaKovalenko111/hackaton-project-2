'use client'

import { useQuery } from '@tanstack/react-query'
import { getInterviewPlanned } from '../interviews-api'

export const useGetInterviews = () => {
    return useQuery({
        queryKey: ['interviews'],
        queryFn: () => getInterviewPlanned(),
        enabled: false,
    })
}
