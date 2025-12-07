'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROLE, ROLE_TRANSLATION } from '@/libs/constants'
import { SocketContext } from '@/libs/hooks/useSocket'
import { CompanyData } from '@/modules/company/domain/company.type'
import { Employee, Role } from '@/modules/profile/domain/profile.types'
import {
    useLogout,
    useSetProfilePhoto,
} from '@/modules/profile/infrastructure/query/mutations'
import { Skill } from '@/modules/skills/domain/skills.types'
import { Team } from '@/modules/teams/domain/teams.type'
import { Camera, Mail, Building2, MessageCircle, XIcon } from 'lucide-react'
import { ChangeEvent, useContext, useState } from 'react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import {
    ImageCrop,
    ImageCropApply,
    ImageCropContent,
    ImageCropReset,
} from '@/components/ui/shadcn-io/image-crop'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { blob } from 'stream/consumers'

function dataURItoBlob(dataURI: string): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1])

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString })
}

type PropsType = {
    employee_id: number
    employee_name: string
    employee_surname: string
    employee_email: string
    employee_status: string
    employee_photo: string
    employee_password: string
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
    company,
}: PropsType) => {
    const { resetSocket } = useContext(SocketContext)
    const { mutate: mutateLogout } = useLogout({ resetSocket })
    const { mutate: mutateSetProfilePhoto } = useSetProfilePhoto()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setCroppedImage(null)
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        setCroppedImage(null)
    }

    return (
        <Card>
            <CardContent>
                <div className="flex flex-col sm:items-center items-center gap-4 md:flex-row md:items-center md:gap-6">
                    <div className="relative">
                        <>
                            <Dialog
                                open={selectedFile !== null}
                                onOpenChange={handleReset}>
                                <DialogContent>
                                    <DialogTitle>
                                        Изменить фото профиля
                                    </DialogTitle>
                                    <div className="space-y-4">
                                        <ImageCrop
                                            aspect={1}
                                            circularCrop
                                            file={selectedFile as File}
                                            maxImageSize={1024 * 1024}
                                            onCrop={setCroppedImage}>
                                            <ImageCropContent className="max-w-md" />
                                            <div className="flex items-center gap-2">
                                                <ImageCropApply />
                                                <ImageCropReset />
                                                <Button
                                                    onClick={handleReset}
                                                    size="icon"
                                                    type="button"
                                                    variant="ghost">
                                                    <XIcon className="size-4" />
                                                </Button>
                                            </div>
                                        </ImageCrop>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            disabled={!croppedImage}
                                            onClick={() => {
                                                if (croppedImage) {
                                                    const newBlob =
                                                        dataURItoBlob(
                                                            croppedImage
                                                        )
                                                    const newFile = new File(
                                                        [newBlob],
                                                        selectedFile?.name ||
                                                            'cropped.png',
                                                        {
                                                            type:
                                                                selectedFile?.type ||
                                                                'image/png',
                                                        }
                                                    )
                                                    mutateSetProfilePhoto(
                                                        newFile
                                                    )
                                                    handleReset()
                                                }
                                            }}>
                                            Сохранить
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_API}/profilePhotos/${employee_photo}`}
                                    alt="Profile"
                                />
                                <AvatarFallback className="text-xl">
                                    {`${employee_name[0]}${employee_surname[0]}`}
                                </AvatarFallback>
                            </Avatar>
                            {isCurrentEmployee && (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
                                    <Input
                                        accept="image/*"
                                        className="absolute cursor-pointer -right-2 -bottom-2 h-8 w-8 rounded-full opacity-0"
                                        onChange={handleFileChange}
                                        type="file"
                                    />
                                    <Camera />
                                </Button>
                            )}
                        </>
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-center md:text-left">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center justify-center md:justify-start">
                            <h1 className="text-2xl font-bold">{`${employee_name} ${employee_surname}`}</h1>
                            <Badge
                                variant="secondary"
                                className="md:mx-2 mx-auto">
                                {ROLE_TRANSLATION[role.role_name]}
                            </Badge>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm justify-center md:justify-start">
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
                    {isCurrentEmployee && (
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                            <Button
                                variant="default"
                                className="md:flex-none flex-1">
                                Изменить профиль
                            </Button>
                            <Button
                                onClick={() => mutateLogout()}
                                variant="destructive"
                                className="md:flex-none flex-1">
                                Выйти
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
