'use client'

import ProtectedRoute from '@/libs/protected-route'
import CalendarInterview from '../calendar/calendar'

export const Interviews = () => {
    return (
        <div
            className="mx-auto animate-appear w-full max-w-6xl space-y-6 px-4 py-10"
            data-testid="interviews-page">
            <ProtectedRoute>
                <CalendarInterview />
            </ProtectedRoute>
        </div>
    )
}
