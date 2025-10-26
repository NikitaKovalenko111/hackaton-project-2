
import { NavItems, NO_INDEX_PAGE } from "@/libs/constants"
import { Header } from "@/libs/view/header/header"
import { Nav } from "@/libs/view/nav/nav"
import { Metadata } from "next"
import { Toaster } from "react-hot-toast"

export default function MainLayout({children}: {children: React.ReactNode}) {

    return (
        <>
            <main>
                <Header>
                    h
                    <Nav navigationMenuItems={NavItems} />
                </Header>
                <div className="mt-30">
                    {children}
                </div>
            </main>
        </>
        
    )
}