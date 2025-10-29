'use client'

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GreetMode } from "@/modules/company/domain/company.type"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { CreateCompany } from "../create-form/create-company"
import { useAuth } from "@/libs/providers/ability-provider"
import { useRouter } from "next/navigation"
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries"

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
    info: 'min-h-[230px]'
}

export const GreetCard = () => {

    const [mode, setMode] = useState<GreetMode>('info')

    const handleModeChange = (value: GreetMode) => {
        setMode(value)
    }

    const {push} = useRouter()

    const {companyId} = useAuth()
    const {data} = useGetProfile()

    useEffect(() => {
        if (data?.company.company_id) push(`/profile`)
    }, [])

    useEffect(() => {
        if (companyId) push('/profile')
    }, [companyId])

    return (
        <Card className={clsx(
            "w-full max-w-sm relative overflow-hidden p-6 animate-appear transition-[min-height]",
            variantStyleCard[mode]
        )}>
            <CardHeader>
                <CardTitle className="text-center text-xl">Данные о компании</CardTitle>
            </CardHeader>
            <div className={clsx(
                "flex flex-col gap-5 absolute top-25 pl-5 pr-5 transition-[left]",
                variantStyleInfo[mode]
            )}>
                <CardDescription className="text-center">Чтобы продолжить, вам необходимо состоять в компании, либо создать компанию</CardDescription>
                <Button 
                    className="w-full cursor-pointer"
                    onClick={() => handleModeChange('create')}
                >
                    Создать компанию
                </Button>
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