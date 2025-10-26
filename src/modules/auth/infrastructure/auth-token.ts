import authConfig from '@/libs/configs/auth';
import { ROLE } from '@/libs/constants';

const Cookies = require('js-cookie')

export const saveTokenStorage = (accessToken: string) => {
    localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    Cookies.set(`${authConfig.storageTokenKeyName}`, accessToken, {
        expires: 1
    })
}

export const saveRefreshStorage = (refreshToken: string) => {
    localStorage.setItem(authConfig.onTokenExpiration, refreshToken, )
    Cookies.set(`${authConfig.onTokenExpiration}`, refreshToken, {
        expires: 30
    })
}

export const saveRoleStorage = (role: ROLE) => {
    localStorage.setItem('role', role)
    Cookies.set('role', role, {
        expires: 30
    })
}