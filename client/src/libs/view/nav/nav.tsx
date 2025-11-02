'use client'

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { NavItem } from "@/libs/constants"
import ProtectedRoute from "@/libs/protected-route"
import Link from "next/link"
import * as Icons from 'lucide-react'
import { cn } from "@/lib/utils"

interface NavProps {
    navigationMenuItems: NavItem[]
}

export const Nav = ({navigationMenuItems}: NavProps) => {

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-5">
                {navigationMenuItems.map((item) => {
                    const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>
                    return (
                        <ProtectedRoute key={item.title} allowedRoles={item.roles}>
                            <NavigationMenuItem key={item.title}>
                                <NavigationMenuLink
                                    className={cn(
                                        "relative group inline-flex h-9 w-max items-center justify-center px-0.5 py-2 text-sm font-medium",
                                        "before:absolute before:bottom-0 before:inset-x-0 before:h-[2px] before:bg-primary before:scale-x-0 before:transition-transform",
                                        "hover:before:scale-x-100 hover:text-accent-foreground",
                                        "focus:before:scale-x-100 focus:text-accent-foreground focus:outline-hidden",
                                        "disabled:pointer-events-none disabled:opacity-50",
                                        "data-active:before:scale-x-100 data-[state=open]:before:scale-x-100",
                                        "hover:bg-transparent active:bg-transparent focus:bg-transparent"
                                    )}
                                    asChild
                                >
                                    <Link href={item.href} className="flex-row items-center gap-2.5">
                                        <IconComponent className="h-5 w-5 stroke-2 text-black shrink-0" />
                                        {item.title}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </ProtectedRoute>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}