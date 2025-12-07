'use client'

import * as Icons from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavItems } from "@/libs/constants";
import ProtectedRoute from "@/libs/protected-route";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

const routeStyle: Record<string, string> = {
    'true': 'bg-black text-white',
    'false': 'bg-transparent text-black'
}

export function AppSidebar() {
    const pathname = usePathname()
    const [curPath, setCurPath] = useState<string>('/')

    const {push} = useRouter()

    useEffect(() => {
        setCurPath(pathname)
    }, [pathname])

    return (
        <Sidebar className='mt-16 md:mt-20 z-3'>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm md:text-base">APC</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NavItems.map((item) => {
                                const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>
                                const selected = curPath.includes(item.href)
                                
                                return (
                                    <ProtectedRoute key={item.title} allowedRoles={item.roles}>
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className={clsx(
                                                    "transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800",
                                                    selected 
                                                        ? "bg-black text-white hover:bg-gray-800" 
                                                        : "bg-transparent text-black dark:text-white"
                                                )}>
                                                    <IconComponent />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </ProtectedRoute>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
