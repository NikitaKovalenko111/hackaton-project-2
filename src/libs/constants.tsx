
// TYPES

export type ROLE = 'hr' | 'developer' | 'teamlead' | 'techlead' | 'admin' | 'moderator'

export interface NavItem {
    roles: ROLE[]
    href: string
    title: string
    icon: string
}


// CONSTANTS

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