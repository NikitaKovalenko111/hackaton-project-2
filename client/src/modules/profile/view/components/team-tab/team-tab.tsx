'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { ROLE_TRANSLATION } from "@/libs/constants"
import { roleBadge } from "@/modules/employees/view/ui/role-badge"
import { Team } from "@/modules/teams/domain/teams.type"

export const TeamTab = ({id, team, isCurrentEmployee}: {id: number, team: Team, isCurrentEmployee: boolean}) => {

    return (
        <TabsContent value="team" className="space-y-6">
            {team ? (
                <Card className="overflow-visible">
                    <CardHeader className="pb-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl">
                                    Информация о команде
                                    <span className="ml-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent-foreground">
                                        {team.team_name}
                                    </span>
                                </CardTitle>
                                {isCurrentEmployee && (
                                    <CardDescription className="mt-1 text-muted-foreground">
                                        Здесь вы можете увидеть информацию о своей команде
                                    </CardDescription>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="rounded-lg bg-muted/50 p-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 ring-2 ring-muted/30">
                                    <AvatarImage src={`${process.env.NEXT_PUBLIC_BACKEND_API}/profilePhotos/${team.teamlead.employee_photo}`} alt="Team Lead" />
                                    <AvatarFallback className="text-xl">
                                        {`${team.teamlead.employee_name[0]}${team.teamlead.employee_surname[0]}`}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-lg font-semibold">{`${team.teamlead.employee_name} ${team.teamlead.employee_surname}`}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Руководитель команды
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xl font-medium">Сотрудники команды</p>
                            <div className="grid gap-4">
                                {team.employees.map((empl) => {
                                    console.log(empl);
                                    
                                    if (id == empl.employee_id) return null
                                    return (
                                        <div
                                            key={empl.employee_id}
                                            className="flex items-center justify-between gap-4 rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-14 w-14">
                                                    <AvatarImage src={`${process.env.NEXT_PUBLIC_BACKEND_API}/profilePhotos/${empl.employee_photo}`} alt="Profile" />
                                                    <AvatarFallback className="text-lg">
                                                        {`${empl.employee_name[0]}${empl.employee_surname[0]}`}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{`${empl.employee_name} ${empl.employee_surname}`}</p>
                                                    <p className="text-sm text-muted-foreground">{ROLE_TRANSLATION[empl.role.role_name] ? empl.role.role_name : ""}</p>
                                                </div>
                                            </div>
                                            <div>{roleBadge(empl.role.role_name)}</div>
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
                        <CardTitle>
                            {isCurrentEmployee ? "Вы не состоите в команде" : "Сотрудник не состоит в компании"}
                        </CardTitle>
                    </CardHeader>
                </Card>
            )}
        </TabsContent>
    )
}