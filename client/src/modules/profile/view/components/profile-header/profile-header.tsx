'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE, ROLE_TRANSLATION } from "@/libs/constants";
import { SocketContext } from "@/libs/hooks/useSocket";
import { Employee } from "@/modules/profile/domain/profile.types";
import { useLogout } from "@/modules/profile/infrastructure/query/mutations";
import { Camera, Calendar, Mail, MapPin, Building2, MessageCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
const Cookies = require('js-cookie')

export const ProfileHeader = ({
    employee_email,
    employee_id,
    employee_name,
    employee_password,
    employee_photo,
    employee_status,
    employee_surname,
    telegram_id,
    role,
    company
}: Employee) => {
    
    const {resetSocket} = useContext(SocketContext)

    const {mutate} = useLogout({resetSocket})
    // const [role, setRole] = useState<ROLE>('developer')

    // useEffect(() => {
    //     setRole(Cookies.get("role"))
    // }, [])

     return (
        <Card>
            <CardContent>
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                            src={employee_photo}
                            alt="Profile"
                            />
                            <AvatarFallback className="text-2xl">{`${employee_name[0]}${employee_surname[0]}`}</AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                        >
                            <Camera />
                        </Button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <h1 className="text-2xl font-bold">{`${employee_name} ${employee_surname}`}</h1>
                            <Badge variant="secondary">{ROLE_TRANSLATION[role.role_name]}</Badge>
                            {/* <Badge variant="secondary">{ROLE_TRANSLATION[role]}</Badge> */}
                        </div>
                        {/* <p className="text-muted-foreground">Senior Product Designer</p> */}
                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="size-4" />
                                {employee_email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Building2 className="size-4" />
                                {company.company_name}
                            </div>
                            {telegram_id && (
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="size-4" />
                                    {telegram_id}
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="default">Изменить профиль</Button>
                    <Button onClick={() => {
                        mutate()
                    }} variant="destructive">Выйти</Button>
                </div>
            </CardContent>
        </Card>
     );
}