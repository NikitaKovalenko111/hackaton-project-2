'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { ROLE_TRANSLATION } from "@/libs/constants"
import { roleBadge } from "@/modules/employees/view/ui/role-badge"
import { Team } from "@/modules/teams/domain/teams.type"

export const TeamTab = ({id, team}: {id: number, team: Team}) => {

    return (
        <TabsContent value="team" className="space-y-6">
            {team ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Информация о команде {team.team_name}</CardTitle>
                        <CardDescription>
                        Здесь вы можете увидеть информацию о своей команде
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-xl font-medium">Руководитель команды: {`${team.teamlead.employee_name} ${team.teamlead.employee_surname}`}</p>
                        {team.employees.map((empl, emplId) => {
                            if (id == empl.employee_id) return null
                            return (
                                <div key={emplId} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage
                                                src={empl.employee_photo}
                                                alt="Profile"
                                            />
                                            <AvatarFallback className="text-2xl">{`${empl.employee_name[0]}${empl.employee_surname[0]}`}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-muted-foreground text-sm">
                                            {`${empl.employee_name} ${empl.employee_surname}`}
                                        </p>
                                        </div>
                                        {roleBadge(empl.role.role_name)}
                                    </div>
                                    <Separator />
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Вы не состоите в команде
                        </CardTitle>
                    </CardHeader>
                </Card>
            )}
        </TabsContent>
    )
}