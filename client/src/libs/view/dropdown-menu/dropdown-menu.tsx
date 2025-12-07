'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavItems } from "@/libs/constants"
import ProtectedRoute from "@/libs/protected-route"
import clsx from "clsx"
import * as Icons from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"


export function DropdownMenuComponent() {

    const pathname = usePathname()
    const [curPath, setCurPath] = useState<string>('')

    useEffect(() => {
        setCurPath(pathname)
    }, [pathname])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Меню</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
        {NavItems.map(item => {

            const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>
            const selected = curPath.includes(item.href)

            return (
                
                    <DropdownMenuItem className={clsx(
                        "transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800",
                            selected 
                                ? "bg-black !text-white hover:bg-gray-800" 
                                : "bg-transparent !text-black dark:text-white"
                    )}>
                        <ProtectedRoute allowedRoles={item.roles}>
                            <Link href={item.href} className="flex items-center gap-2" >
                                <IconComponent 
                                    className={clsx(
                                        "transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800",
                                        selected 
                                            ? "text-white hover:bg-gray-800" 
                                            : "text-black dark:text-white"
                                    )}
                                />
                                {item.title}
                            </Link>
                        </ProtectedRoute>
                    </DropdownMenuItem>
            )
        })}
        </DropdownMenuGroup>
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
