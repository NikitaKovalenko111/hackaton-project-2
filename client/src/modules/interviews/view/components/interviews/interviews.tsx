'use client'

import ProtectedRoute from "@/libs/protected-route"
import CalendarInterview from "../calendar/calendar"

export const Interviews = () => {

    return (
        <div className="mx-auto animate-appear w-full max-w-6xl space-y-4 md:space-y-6 px-2 sm:px-4 py-4 md:py-10">
            <ProtectedRoute>
                <CalendarInterview />
            </ProtectedRoute>
        </div>
    )
}