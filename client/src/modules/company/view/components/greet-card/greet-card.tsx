'use client'

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GreetMode } from "@/modules/company/domain/company.type"
import clsx from "clsx"
import { useContext, useEffect, useState } from "react"
import { CreateCompany } from "../create-form/create-company"
import { useAuth } from "@/libs/providers/ability-provider"
import { useRouter } from "next/navigation"
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries"
import { useLogout } from "@/modules/profile/infrastructure/query/mutations"
import { LogOut } from "lucide-react"
import { SocketContext } from "@/libs/hooks/useSocket"

const variantStyleInfo: { [key in GreetMode]: string } = {
    info: 'left-0',
    create: 'left-100'
}

const variantStyleCreate: { [key in GreetMode]: string } = {
    info: '-left-100',
    create: 'left-0'
}

const variantStyleCard: { [key in GreetMode]: string } = {
    create: 'min-h-[320px]',
    info: 'min-h-[250px]'
}

export const GreetCard = () => {

    const [mode, setMode] = useState<GreetMode>('info')

    const handleModeChange = (value: GreetMode) => {
        setMode(value)
    }

    const {push} = useRouter()

    const {companyId} = useAuth()
    const {data, refetch} = useGetProfile()

    const {resetSocket} = useContext(SocketContext)
    const {mutate} = useLogout({resetSocket})

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        if (data?.company && data?.company.company_id) push(`/profile`)
    }, [data])

    useEffect(() => {
        if (companyId) push('/profile')
    }, [companyId])

    return (
        <Card className={clsx(
            "w-full max-w-sm relative overflow-hidden p-6 animate-appear transition-[min-height]",
            variantStyleCard[mode]
        )} data-testid="greet-card">
            <CardHeader>
                <CardTitle className="text-center text-xl" data-testid="greet-card-title">
                    Данные о компании
                </CardTitle>
            </CardHeader>
            <div className={clsx(
                "flex flex-col gap-5 absolute top-25 pl-5 pr-5 transition-[left]",
                variantStyleInfo[mode]
            )}>
                <CardDescription className="text-center">Чтобы продолжить, вам необходимо состоять в компании, либо создать компанию</CardDescription>
                <div className="flex flex-col gap-2">
                    <Button 
                        className="w-full cursor-pointer"
                        onClick={() => handleModeChange('create')}
                        data-testid="greet-create-company-button"
                    >
                        Создать компанию
                    </Button>
                    <Button 
                        className="w-full cursor-pointer"
                        variant="destructive"
                        onClick={() => mutate()}
                        data-testid="greet-logout-button"
                    >
                        Выйти
                    </Button>
                </div>
            </div>
            <div className={clsx(
                "flex flex-col gap-5 absolute top-25 w-full transition-[left]",
                variantStyleCreate[mode]
            )}>
                <CreateCompany handleModeChange={handleModeChange} />
            </div>
        </Card>
    )
}