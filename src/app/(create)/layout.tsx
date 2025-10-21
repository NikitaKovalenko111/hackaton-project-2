import { NO_INDEX_PAGE } from "@/libs/constants"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Auth',
    ...NO_INDEX_PAGE
}

export default function AuthLayout({children}: {children: React.ReactNode}) {

    return (
        <div>
            {children}
        </div>
    )
}