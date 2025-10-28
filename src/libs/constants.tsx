
// TYPES

import { Employee } from "@/modules/profile/domain/profile.types"
import { socketSlice } from "./slices/socket.slice"
import { Skill } from "@/modules/skills/domain/skills.types"

export type ROLE = 'hr' | 'developer' | 'teamlead' | 'techlead' | 'admin' | 'moderator'

export interface NavItem {
    roles: ROLE[]
    href: string
    title: string
    icon: string
}

export interface Request {
    request_id: number
    request_type: 'upgrade'
    request_status: 'pending' | 'completed' | 'canceled'
    request_date: Date
    request_receiver: Employee
    request_role_receiver: 'hr' | 'developer' | 'teamlead' | 'techlead' | 'admin' | 'moderator'
    request_owner: Employee
    request_skill?: Skill
}


// CONSTANTS

export const SkillLevels = ['junior', 'junior+', 'middle', 'middle+', 'senior']

export const NO_INDEX_PAGE = {
    robots: {
        index: false,
        follow: false
    }
}

export const ROLES: ROLE[] = ['admin', 'developer', 'hr', 'moderator', 'teamlead', 'techlead']

export const ROLE_TRANSLATION: Record<ROLE, string> = {
    'admin': 'Администрация',
    'developer': 'Разработчик',
    "hr": 'HR',
    'moderator': 'Модератор',
    'teamlead': 'Тимлид',
    'techlead': 'Техлид'
}

export const NavItems: NavItem[] = [
    {
        roles: ['admin'],
        title: 'Компетенции',
        href: '/skills-settings',
        icon: 'BicepsFlexed'
    },
    {
        roles: ['admin'],
        title: 'Сотрудники',
        href: '/employees',
        icon: 'User'
    },
    {
        roles: ['admin'],
        title: 'Команды',
        href: '/teams',
        icon: 'Users'
    },
    {
        roles: ['admin', 'developer', 'hr', 'moderator', 'teamlead', 'techlead'],
        title: 'Профиль',
        href: '/profile',
        icon: 'CircleUser'
    }
]

export const rootActions = {
    ...socketSlice.actions
}