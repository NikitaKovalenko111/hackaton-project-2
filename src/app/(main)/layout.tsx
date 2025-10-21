
import { NO_INDEX_PAGE } from "@/libs/constants"
import { Header } from "@/libs/view/header/header"
import { Metadata } from "next"

export default function MainLayout({children}: {children: React.ReactNode}) {

    return (
        <main>
            <Header>
                h
            </Header>
            <div className="mt-30">
                {children}
            </div>
        </main>
    )
}