'use client'

import Image from "next/image"
import { Bell, BellIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import React from "react"
import { useGetNotifications } from "./infrastructure/query/queries"

export const Header = ({
    children
}: {
    children: React.ReactNode
}) => {

    const { data: notifications, isFetching } = useGetNotifications()

    console.log('notifications', notifications)

    return (
        <>
        <div className="fixed flex justify-between top-0 w-full border py-6 shadow-sm z-50 bg-white p-4">
            <p className="uppercase font-bold text-xl" >APC</p>
            <div className="flex gap-8 items-center">
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <BellIcon className="w-5 h-5 cursor-pointer text-black-600 hover:text-black-800" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <p className="font-medium">Уведомления</p>
                                <div className="scrollbar max-h-60 space-y-2 overflow-y-auto">
                                    { notifications && notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification.notification.notification_id} className="p-2 border-b last:border-0">
                                                <p className="text-sm">{
                                                    notification.notification.notification_type === "newRequest" && `Новая заявка от ${notification.object.request_owner.employee_name} ${notification.object.request_owner.employee_surname}` ||
                                                    notification.notification.notification_type === "completedRequest" && `Заявка от ${notification.object.request_owner.employee_name} ${notification.object.request_owner.employee_surname} выполнена` ||
                                                    notification.notification.notification_type === "canceledRequest" && `Заявка от ${notification.object.request_owner.employee_name} ${notification.object.request_owner.employee_surname} отменена` ||
                                                    notification.notification.notification_type === "newInterview" && `Новое интервью с ${notification.object.interview_owner.employee_name} ${notification.object.interview_owner.employee_surname}`
                                                }</p>
                                                <p className="text-xs text-muted-foreground">{new Date(notification.notification.created_at).toLocaleString()}</p>
                                            </div>
                                        ))
                                    )
                                    : (
                                    <div className="text-sm text-muted-foreground">
                                        У вас нет новых уведомлений
                                    </div> )
                                    }
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                {children}
            </div>
        </div>
        </>
    )
}
