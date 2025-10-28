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
                {/* <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                    <Avatar className="h-24 w-24">
                        <AvatarImage
                            src={employee_photo}
                            alt="Profile"
                        />
                        <AvatarFallback className="text-2xl">{`${employee_name[0]}${employee_surname[0]}`}</AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground text-sm">
                        Last changed 3 months ago
                    </p>
                    </div>
                    <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                    </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-muted-foreground text-sm">
                        Add an extra layer of security to your account
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                    >
                        Enabled
                    </Badge>
                    <Button variant="outline" size="sm">
                        Configure
                    </Button>
                    </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                    <Label className="text-base">Login Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                        Get notified when someone logs into your account
                    </p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                    <Label className="text-base">Active Sessions</Label>
                    <p className="text-muted-foreground text-sm">
                        Manage devices that are logged into your account
                    </p>
                    </div>
                    <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    View Sessions
                    </Button>
                </div>
                </div> */}
            </CardContent>
            </Card>
        </TabsContent>
    )
}