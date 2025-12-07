'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dropzone } from "@/components/shadcn-studio/dropzone/dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE, ROLE_TRANSLATION } from "@/libs/constants";
import { SocketContext } from "@/libs/hooks/useSocket";
import { CompanyData } from "@/modules/company/domain/company.type";
import { Employee, Role } from "@/modules/profile/domain/profile.types";
import { useLogout, useSetProfilePhoto } from "@/modules/profile/infrastructure/query/mutations";
import { Skill } from "@/modules/skills/domain/skills.types";
import { Team } from "@/modules/teams/domain/teams.type";
import { Camera, Calendar, Mail, MapPin, Building2, MessageCircle, FileInput } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-day-picker";
import { useGetProfilePhoto } from "@/modules/profile/infrastructure/query/queries";
import { base64 } from "zod";
import { File } from "buffer";
const Cookies = require('js-cookie')

type PropsType = {
    employee_id: number;
    employee_name: string;
    employee_surname: string;
    employee_email: string;
    employee_status: string;
    employee_photo: string;
    employee_password: string;
    telegram_id: number
    role: Role
    team: Team
    skills: Skill[]
    company: CompanyData
    isCurrentEmployee: boolean
}

export const ProfileHeader = ({
    employee_email,
    employee_id,
    employee_name,
    employee_password,
    employee_photo,
    employee_status,
    employee_surname,
    telegram_id,
    isCurrentEmployee,
    role,
    company
}: PropsType) => {
    
    const {resetSocket} = useContext(SocketContext)

    const {mutate: mutateLogout} = useLogout({resetSocket})
    const {mutate: mutateSetProfilePhoto} = useSetProfilePhoto()
    // const [role, setRole] = useState<ROLE>('developer')

    // useEffect(() => {
    //     setRole(Cookies.get("role"))
    // }, [])

     return (
        <Card>
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col items-start gap-4 md:gap-6 sm:flex-row sm:items-center">
                    <div className="relative mx-auto sm:mx-0">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24">
                            <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_BACKEND_API}/profilePhotos/${employee_photo}`}
                            alt="Profile"
                            />
                            <AvatarFallback className="text-lg md:text-xl">
                                {`${employee_name[0]}${employee_surname[0]}`}
                            </AvatarFallback>
                        </Avatar>
                        {
                            isCurrentEmployee &&
                            <>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                                >
                                    <input type="file" onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            mutateSetProfilePhoto(e.target.files[0])
                                        }
                                    }} className="absolute cursor-pointer -right-2 -bottom-2 h-8 w-8 rounded-full opacity-0" />
                                    <Camera />
                                </Button>
                            </>
                        }
                    </div>
                    <div className="flex-1 space-y-2 w-full sm:w-auto">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <h1 className="text-xl md:text-2xl font-bold break-words">{`${employee_name} ${employee_surname}`}</h1>
                            <Badge variant="secondary" className="w-fit">{ROLE_TRANSLATION[role.role_name]}</Badge>
                            {/* <Badge variant="secondary">{ROLE_TRANSLATION[role]}</Badge> */}
                        </div>
                        {/* <p className="text-muted-foreground">Senior Product Designer</p> */}
                        <div className="text-muted-foreground flex flex-wrap gap-3 md:gap-4 text-sm">
                            <div className="flex items-center gap-1 break-all">
                                <Mail className="size-4 shrink-0" />
                                <span className="break-all">{employee_email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Building2 className="size-4 shrink-0" />
                                {company.company_name}
                            </div>
                            {telegram_id && (
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="size-4 shrink-0" />
                                    {telegram_id}
                                </div>
                            )}
                        </div>
                    </div>
                    {
                        isCurrentEmployee &&
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button variant="default" className="w-full sm:w-auto whitespace-nowrap">Изменить профиль</Button>
                            <Button onClick={() => {
                                mutateLogout()
                            }} variant="destructive" className="w-full sm:w-auto">Выйти</Button>
                        </div>
                    }
                </div>
            </CardContent>
        </Card>
     );
}