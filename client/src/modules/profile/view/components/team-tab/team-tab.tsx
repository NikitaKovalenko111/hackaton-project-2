'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { ROLE, ROLE_TRANSLATION } from '@/libs/constants'
import { roleBadge } from '@/modules/employees/view/ui/role-badge'
import { useGetAiReview } from '@/modules/profile/infrastructure/query/mutations'
import { Team } from '@/modules/teams/domain/teams.type'
import { Dialog } from '@radix-ui/react-dialog'
import { on } from 'events'
import { useState } from 'react'
import { AiReviewDialog } from '../ai-review-dialog/ai-review-dialog'
import Link from 'next/link'

export const TeamTab = ({
    id,
    team,
    isCurrentEmployee,
    role,
}: {
    id: number
    team: Team
    isCurrentEmployee: boolean
    role: ROLE
}) => {
    const [openReviewDialog, setOpenReviewDialog] = useState<boolean>(false)
    const [employeeName, setEmployeeName] = useState<string>('')
    const [employeeSurname, setEmployeeSurname] = useState<string>('')

    const { data, mutate: getAiReview } = useGetAiReview(setOpenReviewDialog)

    return (
        <>
            <Dialog open={openReviewDialog} onOpenChange={setOpenReviewDialog}>
                <AiReviewDialog
                    message={data ? data.message : ''}
                    employeeName={employeeName}
                    employeeSurname={employeeSurname}
                />
            </Dialog>
            <TabsContent value="team" className="space-y-4 md:space-y-6">
                {team ? (
                    <Card className="overflow-visible">
                        <CardHeader className="pb-0">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="w-full">
                                    <CardTitle className="text-lg sm:text-2xl">
                                        Информация о команде
                                        <span className="ml-2 inline-block rounded-full bg-accent/10 px-2 py-1 text-xs sm:text-sm font-medium text-accent-foreground">
                                            {team.team_name}
                                        </span>
                                    </CardTitle>
                                    {isCurrentEmployee && (
                                        <CardDescription className="mt-1 text-xs sm:text-sm text-muted-foreground">
                                            Здесь вы можете увидеть информацию о
                                            своей команде
                                        </CardDescription>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 md:space-y-6">
                            <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
                                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                                    <Avatar className="h-16 w-16 ring-2 ring-muted/30 sm:h-20 sm:w-20">
                                        <AvatarImage
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_API}/profilePhotos/${team.teamlead.employee_photo}`}
                                            alt="Team Lead"
                                        />
                                        <AvatarFallback className="text-lg">
                                            {`${team.teamlead.employee_name[0]}${team.teamlead.employee_surname[0]}`}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center sm:text-left">
                                        <p className="text-base sm:text-lg font-semibold">{`${team.teamlead.employee_name} ${team.teamlead.employee_surname}`}</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Руководитель команды
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-lg sm:text-xl font-medium">
                                    Сотрудники команды
                                </p>
                                <div className="grid gap-3 sm:gap-4">
                                    {team.employees.map((empl) => {
                                        console.log(empl)

                                        if (id == empl.employee_id) return null
                                        return (
                                            <div
                                                key={empl.employee_id}
                                                className="flex flex-col items-start justify-between gap-3 rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-4">
                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                                                        <AvatarImage
                                                            src={`${process.env.NEXT_PUBLIC_BACKEND_API}/profilePhotos/${empl.employee_photo}`}
                                                            alt="Profile"
                                                        />
                                                        <AvatarFallback className="text-base">
                                                            {`${empl.employee_name[0]}${empl.employee_surname[0]}`}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <Link
                                                        href={`profile/${empl.employee_id}`}>
                                                        <p className="text-sm sm:text-base font-medium">{`${empl.employee_name} ${empl.employee_surname}`}</p>
                                                    </Link>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-4 sm:w-auto">
                                                    {isCurrentEmployee &&
                                                    role === 'teamlead' ? (
                                                        <Button
                                                            onClick={() => {
                                                                setEmployeeName(
                                                                    empl.employee_name
                                                                )
                                                                setEmployeeSurname(
                                                                    empl.employee_surname
                                                                )
                                                                getAiReview(
                                                                    empl.employee_id
                                                                )
                                                            }}
                                                            className="w-full sm:w-auto">
                                                            Ревью
                                                        </Button>
                                                    ) : null}
                                                    {roleBadge(
                                                        empl.role.role_name
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-2xl">
                                {isCurrentEmployee
                                    ? 'Вы не состоите в команде'
                                    : 'Сотрудник не состоит в компании'}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                )}
            </TabsContent>
        </>
    )
}
