
import { NavItems, NO_INDEX_PAGE } from "@/libs/constants"
import { Header } from "@/libs/view/header/header"
import { Nav } from "@/libs/view/nav/nav"
import { AppSidebar } from "@/libs/view/siderbar/sidebar"
import { Metadata } from "next"
import { Suspense } from "react"
import { Toaster } from "react-hot-toast"
import Loading from "../loading"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function MainLayout({children}: {children: React.ReactNode}) {

    return (
        <>
            <main className="w-full min-h-screen">
                <Header />
                <AppSidebar />
                <Suspense fallback={<Loading />}>
                    <div className="flex items-start justify-center mt-20 md:mt-30 px-2 md:px-4">
                        {children}
                    </div>
                </Suspense>
            </main>
        </>
        
    )
}