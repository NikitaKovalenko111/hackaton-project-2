'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PersonalTab } from "../personal-tab/personal-tab";
import { Skill } from "@/modules/skills/domain/skills.types";
import { ProfileSkillsTab } from "../profile-skills/profile-skills";
import { TeamTab } from "../team-tab/team-tab";
import { Team } from "@/modules/teams/domain/teams.type";
import ProtectedRoute from "@/libs/protected-route";
import { useAuth } from "@/libs/providers/ability-provider";
import clsx from "clsx";
import { ROLE } from "@/libs/constants";
import { RequestsTab } from "../requests-tab/requests-tab";
import { useGetProfile } from "@/modules/profile/infrastructure/query/queries";
import { useEffect, useState } from "react";

interface ProfileContentProps {
    id: number
    employee_name: string;
    employee_surname: string;
    employee_email: string;
    employee_status: string;
    skills: Skill[]
    isCurrentEmployee: boolean
    team: Team
}

const tabList: Record<ROLE, string> = {
    admin: 'grid-cols-3',
    techlead: 'grid-cols-4',
    teamlead: 'grid-cols-4',
    developer: 'grid-cols-3',
    hr: 'grid-cols-3',
    moderator: 'grid-cols-3'
}

export const ProfileContent = ({
    employee_email,
    employee_name,
    employee_status,
    employee_surname,
    isCurrentEmployee,
    skills,
    team,
    id
}: ProfileContentProps) => {

    const {data, refetch} = useGetProfile()
    const [role, setRole] = useState<ROLE>('developer')

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        if (data && data.role) setRole(data.role.role_name)
    }, [data])

    return (
        <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className={clsx(
                `grid w-full gap-2`,
                'grid-cols-2 lg:grid-cols-4',
                tabList[role]
            )}>
                <TabsTrigger value="personal">Личное</TabsTrigger>
                <TabsTrigger value="skills">Компетенции</TabsTrigger>
                {
                    isCurrentEmployee && (
                    <>
                    <TabsTrigger value="team">Команда</TabsTrigger>
                    <ProtectedRoute allowedRoles={['teamlead', 'techlead']}>
                        <TabsTrigger value="requests">Запросы</TabsTrigger>
                    </ProtectedRoute>
                    </>
                    )
                }
            </TabsList>
        

        <PersonalTab
            isCurrentEmployee={isCurrentEmployee}
            employee_email={employee_email}
            employee_name={employee_name}
            employee_status={employee_status}
            employee_surname={employee_surname}
        />

        <ProfileSkillsTab
            isCurrentEmployee={isCurrentEmployee}
            employeeId={id}
            skills={skills}
        />

        {
            isCurrentEmployee && 
            <TeamTab
                role={role}
                isCurrentEmployee={isCurrentEmployee}
                id={id}
                team={team}
            />
        }


        <ProtectedRoute allowedRoles={['teamlead', 'techlead']}>
            <RequestsTab 
                employeeId={id}
            />
        </ProtectedRoute>

        <TabsContent value="notifications" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                    Choose what notifications you want to receive.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-muted-foreground text-sm">
                                    Receive notifications via email
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Push Notifications</Label>
                                <p className="text-muted-foreground text-sm">
                                    Receive push notifications in your browser
                                </p>
                            </div>
                            <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Marketing Emails</Label>
                                <p className="text-muted-foreground text-sm">
                                    Receive emails about new features and updates
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Weekly Summary</Label>
                                <p className="text-muted-foreground text-sm">
                                    Get a weekly summary of your activity
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Security Alerts</Label>
                                <p className="text-muted-foreground text-sm">
                                    Important security notifications (always enabled)
                                </p>
                            </div>
                            <Switch checked disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
    );
}
