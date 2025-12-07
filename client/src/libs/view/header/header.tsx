'use client'

import { useEffect } from 'react'
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu'
import { useApplyNotification } from './infrastructure/query/mutations'
import { useGetNotifications } from './infrastructure/query/queries'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BellIcon, CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Header = ({ children }: { children?: React.ReactNode }) => {
    const {
        data: notifications,
        isFetching,
        refetch: refetchNotifications,
    } = useGetNotifications()

    const applyNotificationMutation = useApplyNotification(refetchNotifications)

    useEffect(() => {
        refetchNotifications()
    }, [])

    const onApplyNotification = (id: number) => {
        applyNotificationMutation.mutate(id)
    }

    return (
        <>
            <div className="fixed flex justify-between top-0 w-full border py-6 shadow-sm z-2 bg-white p-4">
                <p className="uppercase font-bold text-xl">APC</p>
                {/* <SidebarTrigger /> */}
                <div className="flex gap-8 items-center">
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <BellIcon
                                    fill={
                                        notifications &&
                                        notifications?.length > 0
                                            ? '#000'
                                            : 'transparent'
                                    }
                                    className="w-5 h-5 cursor-pointer text-black-600 hover:text-black-800"
                                />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <p className="font-medium">Уведомления</p>
                                    <div className="scrollbar max-h-60 space-y-2 overflow-y-auto">
                                        {notifications &&
                                        notifications.length > 0 ? (
                                            notifications.map(
                                                (notification) => (
                                                    <div
                                                        key={
                                                            notification
                                                                .notification
                                                                .notification_id
                                                        }
                                                        className="p-2 border-b last:border-0 grid gap-2">
                                                        <p className="text-sm">
                                                            {(notification
                                                                .notification
                                                                .notification_type ===
                                                                'newRequest' &&
                                                                `Новая заявка от ${notification.object.request_owner.employee_name} ${notification.object.request_owner.employee_surname}`) ||
                                                                (notification
                                                                    .notification
                                                                    .notification_type ===
                                                                    'completedRequest' &&
                                                                    `Ваша заявка одобрена`) ||
                                                                (notification
                                                                    .notification
                                                                    .notification_type ===
                                                                    'canceledRequest' &&
                                                                    `Заявка от ${notification.object.request_owner.employee_name} ${notification.object.request_owner.employee_surname} отменена`) ||
                                                                (notification
                                                                    .notification
                                                                    .notification_type ===
                                                                    'newInterview' &&
                                                                    `Новое интервью с ${notification.object.interview_owner.employee_name} ${notification.object.interview_owner.employee_surname}`)}
                                                        </p>
                                                        {notification
                                                            .notification
                                                            .notification_type ===
                                                            'canceledRequest' && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Причина:{' '}
                                                                {
                                                                    notification
                                                                        .object
                                                                        .justification
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                notification
                                                                    .notification
                                                                    .created_at
                                                            ).toLocaleString()}
                                                        </p>
                                                        <Button
                                                            onClick={() =>
                                                                onApplyNotification(
                                                                    notification
                                                                        .notification
                                                                        .notification_id
                                                                )
                                                            }
                                                            size="sm"
                                                            variant={
                                                                notification
                                                                    .notification
                                                                    .notification_status ==
                                                                'applied'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                            disabled={
                                                                notification
                                                                    .notification
                                                                    .notification_status ==
                                                                'applied'
                                                            }>
                                                            {notification
                                                                .notification
                                                                .notification_status ==
                                                            'applied'
                                                                ? 'Просмотрено'
                                                                : 'Отметить как прочитанное'}
                                                        </Button>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                У вас нет новых уведомлений
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Link
                        href={'/profile'}
                        className="flex-row items-center gap-2.5">
                        <CircleUser className="h-5 w-5 stroke-2 text-black shrink-0" />
                    </Link>
                    <div className="md:hidden">
                        <DropdownMenuComponent />
                    </div>
                </div>
            </div>
        </>
    )
}
